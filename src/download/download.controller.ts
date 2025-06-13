import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { DocumentIdDTO, ImageIdQueryDTO, InvoiceIdDTO } from './DTO';
import { DownloadService } from './download.service';
import { AuthGuard } from '../common/decorators';
import { BaseController } from '../common/base';
import { AuthUser } from '../auth/decorators';
import { Person } from '../auth/models';

@AuthGuard()
@ApiBearerAuth()
@Controller('download')
@ApiTags('Download')
export class DownloadController extends BaseController {
  constructor(
    private readonly downloadService: DownloadService
  ) {
    super();
  }
  @Header('Content-type', 'image/png')
  @ApiOkResponse({ description: 'File', })
  @Get('image')
  async downloadImage(@Query() query: ImageIdQueryDTO, @Res() res: Response): Promise<void> {
    const file = await this.downloadService.downloadImage(query);
    res.set('Content-Type', file.contentType);
    file.stream.pipe(res);
  }

  @Header('Content-type', 'application/pdf')
  @ApiOkResponse({ description: 'File', })
  @Get('invoice')
  async downloadInvoice(@Query() query: InvoiceIdDTO, @Res() res: Response): Promise<void> {
    const file = await this.downloadService.downloadInvoice(query);
    res.contentType(file.contentType);
    res.attachment(file.fileName);
    file.stream.pipe(res);
  }

  @Header('Content-type', 'application/pdf')
  @ApiOkResponse({ description: 'File', })
  @Get('document')
  async downloadDocuments(@AuthUser() person: Person, @Query() query: DocumentIdDTO, @Res() res: Response): Promise<void> {
    const file = await this.downloadService.downloadDocuments(person, query);
    res.contentType(file.contentType);
    res.attachment(file.fileName);
    file.stream.pipe(res);
  }
}
