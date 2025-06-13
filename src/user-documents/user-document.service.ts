import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserDocumentRepository } from './user-document.repository';

import { UsersDocumentsStatus } from '../common/enums';
import { UserService } from '../users/user.service';
import { FileService } from '../files/file.service';
import { UsersDocuments } from './user-document.entity';
import type { Person } from '../auth/models';
import type { User } from '../users/user.entity';
import type { DocumentsQueryStatuses } from './common/types';
import type {
  DocumentsStatusResponseDTO,
  GetAllDocumentsDTO,
  GetDocumentResponseDTO,
  GetDocumentsResponseDTO,
  UpdateDocumentsDTO,
  UpdateDocumentsResponseDTO
} from './DTO';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserDocumentService {
  constructor(
    private readonly usersDocumentsRepository: UserDocumentRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService
  ) {
  }

  readAllByAdmin(person: Person, query: GetAllDocumentsDTO): Promise<Array<GetDocumentsResponseDTO>> {
    const { orderBy, search, sorting, ...queryStatuses } = query;
    const statuses = this.getStatuses(queryStatuses);
    const options = { orderBy, search, sorting, statuses, };
    return this.usersDocumentsRepository.readAllByAdmin(options);
  }

  async update(id: number, body: UpdateDocumentsDTO): Promise<UpdateDocumentsResponseDTO> {
    await this.getDocumentById(id);
    return this.usersDocumentsRepository.updateEntity(id, { ...body, });
  }

  read(id: number): Promise<GetDocumentResponseDTO> {
    return this.getDocumentById(id);
  }

  async getInvoicingPermissions(user: User): Promise<boolean> {
    const documents = await this.getDocumentByUser(user);
    return documents ? documents.status === UsersDocumentsStatus.VERIFIED : false;
  }

  getDocumentByUser(user: User): Promise<UpdateDocumentsResponseDTO> {
    return this.usersDocumentsRepository.readEntity({ where: { user, }, });
  }

  async uploadUpdate(fileId: number, userId: number): Promise<UsersDocuments> {
    const user = await this.userService.readById(userId);
    const document = await this.getDocumentByUser(user);
    const file = await this.fileService.readById(fileId);

    if (!document) {
      return this.usersDocumentsRepository.createEntity({ file, user, status: UsersDocumentsStatus.PROCESSING, });
    }

    switch (document.status) {
    case UsersDocumentsStatus.VERIFIED:
    case UsersDocumentsStatus.PROCESSING:
      throw new BadRequestException(`This documents already ${document.status}`);
    case UsersDocumentsStatus.NOT_VERIFIED:
    case UsersDocumentsStatus.NOT_LOAD:
      return this.usersDocumentsRepository.updateEntity(document.id, { file, user, status: UsersDocumentsStatus.PROCESSING, });
    }
  }

  async getDocumentStatus(userId: number): Promise<DocumentsStatusResponseDTO> {
    const user = await this.userService.readById(userId);
    const document = await this.getDocumentByUser(user);
    return {
      status: document ? document.status : UsersDocumentsStatus.NOT_LOAD,
      comment: document ? document.comment : null,
    };
  }

  async getDocumentById(id: number, relations?: Array<string>): Promise<UsersDocuments> {
    let options = null;
    if (relations) {
      options = { relations, };
    }
    const document = await this.usersDocumentsRepository.readEntityById(id, options);
    if (!document) {
      throw new NotFoundException('Document with this id was not found');
    }
    return document;
  }

  private getStatuses(queryStatuses: DocumentsQueryStatuses): Array<UsersDocumentsStatus> {
    type DocumentsStatus = keyof DocumentsQueryStatuses;
    const statusMap: Record<DocumentsStatus, UsersDocumentsStatus> = {
      verifiedStatus: UsersDocumentsStatus.VERIFIED,
      notVerifiedStatus: UsersDocumentsStatus.NOT_VERIFIED,
      processingStatus: UsersDocumentsStatus.PROCESSING,
      notLoaded: UsersDocumentsStatus. NOT_LOAD,
    };
    return Object.keys(queryStatuses)
      .filter((status: DocumentsStatus) => queryStatuses[status] === true)
      .map((status: DocumentsStatus) => statusMap[status]);
  }
}
