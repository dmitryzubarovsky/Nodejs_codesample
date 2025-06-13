import { Controller, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { Access, ApiFile, AuthGuard, Roles } from '../common/decorators';
import { AccessEnum, AdminRoleEnum, StorageContainerEnum } from '../common/enums';
import { UploadService } from './upload.service';
import { BaseController } from '../common/base';
import { maxImageSize } from '../common/constants';
import {
  DocumentUploadResponseDTO,
  ImageUploadResponseDTO,
  InvoiceUploadResponseDTO,
  UploadImageTypeDTO,
  VideoUploadResponseDTO
} from './DTO';
import { ParseFilePipe } from '../common/pipes';
import { AuthUser } from '../auth/decorators';
import { Person } from '../auth/models';

@Controller('upload')
@ApiTags('Upload')
export class UploadController extends BaseController {
  constructor(private readonly uploadService: UploadService) {
    super();
  }

  @ApiCreatedResponse({ description: 'Returns imageId and fileId', type: ImageUploadResponseDTO, })
  @Post('image')
  @ApiFile('file')
  @ApiQuery({ enum: StorageContainerEnum, name: 'type', })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: maxImageSize, }, }))
  uploadImage(
    @UploadedFile(new ParseFilePipe([ 'image/png', 'image/jpeg', ])) file: Express.Multer.File,
    @Query() query: UploadImageTypeDTO
  ): Promise<ImageUploadResponseDTO> {
    return this.uploadService.saveImage(file, query.type);
  }

  @ApiCreatedResponse({ description: 'Returns videoId', type: VideoUploadResponseDTO, })
  @AuthGuard()
  @ApiBearerAuth()
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, AdminRoleEnum.CONTENT, ])
  @Access(AccessEnum.ADMIN)
  @Post('video')
  @ApiFile('file')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { dest: 'src/upload', }))
  uploadVideo(@UploadedFile() video: Express.Multer.File): Promise<VideoUploadResponseDTO> {
    return this.uploadService.uploadVideo(video);
  }

  @ApiCreatedResponse({ description: 'Returns invoice id', type: InvoiceUploadResponseDTO, })
  @AuthGuard()
  @ApiBearerAuth()
  @Access(AccessEnum.USER)
  @Post('invoice')
  @ApiFile('file')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadInvoice(@UploadedFile(new ParseFilePipe([ 'application/pdf', ])) invoice: Express.Multer.File, @AuthUser() user: Person ): Promise<InvoiceUploadResponseDTO> {
    return this.uploadService.uploadInvoice(user, invoice);
  }

  @ApiCreatedResponse({ description: 'Returns users document id', type: DocumentUploadResponseDTO, })
  @AuthGuard()
  @ApiBearerAuth()
  @Access(AccessEnum.USER)
  @Post('users-document')
  @ApiFile('file')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  uploadUsersDocuments(
    @UploadedFile(new ParseFilePipe([ 'application/pdf', ])) document: Express.Multer.File,
    @AuthUser() user: Person): Promise<DocumentUploadResponseDTO> {
    return this.uploadService.uploadDocument(user, document);
  }
}
