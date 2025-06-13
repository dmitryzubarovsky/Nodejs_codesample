import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { v4 } from 'uuid';

import Jimp from 'jimp';
import path from 'path';

import type {
  DocumentUploadResponseDTO,
  ImageUploadResponseDTO,
  InvoiceUploadResponseDTO,
  VideoUploadResponseDTO
} from './DTO';
import { KeyTemplate, StorageContainerEnum } from '../common/enums';
import { ImageService } from '../images/image.service';
import { FileService } from '../files/file.service';
import type { File } from '../files/file.entity';
import { MediaStorageService } from '../media-storage/media-storage.service';
import { calculateKey } from '../common/utilities';
import { VideoService } from '../video/video.service';
import { mustBeNotEmpty } from '../common/validators';
import { imageSizes } from '../common/constants';
import type { Upload } from './common/types';
import { InvoiceService } from '../invoices/invoice.service';
import type { Person } from '../auth/models';
import { UserDocumentService } from '../user-documents/user-document.service';

@Injectable()
export class UploadService {
  constructor(
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService,
    @Inject(forwardRef(() => MediaStorageService))
    private readonly mediaStorageService: MediaStorageService,
    @Inject(forwardRef(() => VideoService))
    private readonly videoService: VideoService,
    @Inject(forwardRef(() => InvoiceService))
    private readonly invoicesService: InvoiceService,
    @Inject(forwardRef(() => UserDocumentService))
    private readonly usersDocumentsService: UserDocumentService
  ) { }

  async saveImage(file: Express.Multer.File, containerName: StorageContainerEnum): Promise<ImageUploadResponseDTO> {
    const createdFile = await this.uploadImage(file, containerName, KeyTemplate.IMAGE);
    const image = await this.imageService.create(createdFile.id);
    return { fileId: image.fileId, imageId: image.id, };
  }

  async uploadVideo(file: Express.Multer.File): Promise<VideoUploadResponseDTO> {
    mustBeNotEmpty(file, 'file');
    try {
      const video = await this.videoService.upload(file.path, file.originalname);
      await fs.unlink(file.path);
      return { videoId: video.id, };
    } catch (e) {
      await fs.unlink(file.path);
      throw new BadRequestException({ message: e, });
    }
  }

  async uploadInvoice(user: Person, file: Express.Multer.File): Promise<InvoiceUploadResponseDTO> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.resolve('./src/upload', fileName);

    await fs.writeFile(filePath, file.buffer);
    const createdFile = await this.uploadFile({
      fileName: file.originalname,
      contentType: file.mimetype,
      buffer:  file.buffer,
    }, 'invoices', KeyTemplate.INVOICES);
    await fs.unlink(filePath);
    const invoice = await this.invoicesService.create(createdFile.id, user.userId);
    return { fileId: createdFile.id, invoiceId: invoice.id, };
  }

  async uploadDocument(user: Person, file: Express.Multer.File): Promise<DocumentUploadResponseDTO> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.resolve('./src/upload', fileName);

    await fs.writeFile(filePath, file.buffer);
    const createdFile = await this.uploadFile({
      fileName: file.originalname,
      contentType: file.mimetype,
      buffer:  file.buffer,
    }, 'documents', KeyTemplate.DOCUMENTS);
    await fs.unlink(filePath);
    const document = await this.usersDocumentsService.uploadUpdate(createdFile.id, user.userId);
    return { fileId: createdFile.id, documentId: document.id, };
  }

  private async uploadImage(file: Express.Multer.File, containerName: StorageContainerEnum, template: KeyTemplate): Promise<File> {
    const width = imageSizes[containerName];
    const resizedFileBuffer = await this.resizeImage(file.buffer, width);
    return this.uploadFile({
      fileName: `${Date.now()}-${file.originalname}`,
      buffer: resizedFileBuffer,
      contentType: file.mimetype,
    }, containerName, template);
  }

  private async resizeImage(buffer: Buffer, width: number): Promise<Buffer> {
    const jimpFile = await Jimp.create(buffer);
    const oldWidth = jimpFile.getWidth();
    const scale = oldWidth / width;
    const height = Math.floor(jimpFile.getHeight() / scale);
    const mimeType = jimpFile.getMIME();
    return jimpFile
      .resize(width, height)
      .getBufferAsync(mimeType);
  }

  private async uploadFile(file: Upload, containerName: string, template: KeyTemplate): Promise<File> {
    const fileName = `${v4()}-${file.fileName}`;
    const createdFile = await this.fileService.create({
      containerName,
      fileName,
      fileSize: file.buffer.byteLength,
      contentType: file.contentType,
    });
    const key = calculateKey(template, {
      storage: containerName,
      id: createdFile.id,
    });
    await this.mediaStorageService.upload(key, file.buffer);
    return createdFile;
  }
}
