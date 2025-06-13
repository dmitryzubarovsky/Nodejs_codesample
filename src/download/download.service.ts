import { ForbiddenException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { AppConfigService } from '../common/services';
import { CONFIG_PROVIDER_TOKEN } from '../common/services/types';
import { ImageService } from '../images/image.service';
import { FileService } from '../files/file.service';
import { MediaStorageService } from '../media-storage/media-storage.service';
import { calculateKey } from '../common/utilities';
import { KeyTemplate, UsersDocumentsStatus } from '../common/enums';
import type { DocumentIdDTO, ImageIdQueryDTO, InvoiceIdDTO } from './DTO';
import type { ResponseFile } from './common/types';
import { InvoiceService } from '../invoices/invoice.service';
import { UserDocumentService } from '../user-documents/user-document.service';
import type { Person } from '../auth/models';

@Injectable()
export class DownloadService {
  constructor(
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly config: AppConfigService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => ImageService))
    private readonly imageService: ImageService,
    @Inject(forwardRef(() => InvoiceService))
    private readonly invoicesService: InvoiceService,
    @Inject(forwardRef(() => UserDocumentService))
    private readonly usersDocumentsService: UserDocumentService,
    @Inject(forwardRef(() => MediaStorageService))
    private readonly mediaStorageService: MediaStorageService
  ) { }

  private _contentType: string;

  get contentType(): string {
    return this._contentType;
  }

  async downloadImage(query: ImageIdQueryDTO): Promise<ResponseFile> {
    const image = await this.imageService.readImageById(query.imageId, query.containerName);
    const key = calculateKey(KeyTemplate.IMAGE, { storage: query.containerName, id: image.fileId, });
    const stream = await this.mediaStorageService.getObject(key, `${this.config.mediaStorageConfig.bucketImageName}`);
    return {
      fileName: image.file.fileName,
      stream,
      contentType: image.file.contentType,
    };
  }

  async downloadInvoice(query: InvoiceIdDTO): Promise<ResponseFile> {
    const invoice = await this.invoicesService.readInvoiceById(query.invoiceId);
    const key = calculateKey(KeyTemplate.INVOICES, { storage: invoice.file.containerName, id: invoice.file.id, });
    const stream = await this.mediaStorageService.getObject(key, `${this.config.mediaStorageConfig.bucketImageName}`);
    return {
      fileName: invoice.file.fileName,
      stream,
      contentType: invoice.file.contentType,
    };
  }

  async downloadDocuments(person: Person, query: DocumentIdDTO): Promise<ResponseFile> {
    const document = await this.usersDocumentsService.getDocumentById(query.documentId, [ 'file', 'user', ]);
    if (!person.isAdmin && document.user.id !== person.userId) {
      throw new ForbiddenException('Access is unavailable');
    }

    if (document.status === UsersDocumentsStatus.NOT_LOAD) {
      throw new NotFoundException('Document with this id and type was not found');
    }
    const key = calculateKey(KeyTemplate.DOCUMENTS, { storage: document.file.containerName, id: document.file.id, });
    const stream = await this.mediaStorageService.getObject(key, `${this.config.mediaStorageConfig.bucketImageName}`);
    return {
      fileName: document.file.fileName,
      stream,
      contentType: document.file.contentType,
    };
  }

  private async setContentType(fileId: number): Promise<void> {
    const fileRecord = await this.fileService.readById(fileId);
    this._contentType = fileRecord.contentType;
  }
}
