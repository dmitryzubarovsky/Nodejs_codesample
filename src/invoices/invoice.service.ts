import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { UserService } from '../users/user.service';
import { InvoiceRepository } from './invoice.repository';
import { FileService } from '../files/file.service';
import type { Invoice } from './invoice.entity';
import { InvoicesStatusEnum } from '../common/enums';
import type {
  GetAllInvoicesAdminResponseDTO,
  GetAllInvoicesDTO,
  GetAllInvoicesUserResponseDTO,
  UpdateInvoicesDTO
} from './DTO';
import type { Person } from '../auth/models';
import type { InvoicesQueryStatuses } from './common/types';
import type { UpdateInvoicesResponseDTO } from './DTO/update-invoices-response.dto';
import { UserDocumentService } from '../user-documents/user-document.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoicesRepository: InvoiceRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => FileService))
    private readonly fileService: FileService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
    @Inject(forwardRef(() => UserDocumentService))
    private readonly usersDocumentsService: UserDocumentService
  ) { }

  readAllByAdmin(query: GetAllInvoicesDTO): Promise<Array<GetAllInvoicesAdminResponseDTO>> {
    const { orderBy, search, sorting, ...queryStatuses } = query;
    const statuses = this.getStatuses(queryStatuses);
    const options = { orderBy, search, sorting, statuses, };
    return this.invoicesRepository.readAllByAdmin(options);
  }

  async readAllByUser(person: Person, userId: number): Promise<Array<GetAllInvoicesUserResponseDTO>> {
    if (!person.isAdmin && person.userId !== userId) {
      throw new ForbiddenException('Access is unavailable');
    }
    await this.userService.readById(userId);
    return this.invoicesRepository.readAllByUser(userId);
  }

  async read(id: number): Promise<GetAllInvoicesAdminResponseDTO> {
    await this.readInvoiceById(id);
    const [ invoice, ] = await this.invoicesRepository.readByAdmin(id);
    return invoice;
  }

  async update(person: Person, id: number, body: UpdateInvoicesDTO): Promise<UpdateInvoicesResponseDTO> {
    const invoice = await this.readInvoiceById(id);
    if (invoice.status === InvoicesStatusEnum.ACCEPTED) {
      throw new BadRequestException('This invoice already Accepted');
    }
    if (body.status === InvoicesStatusEnum.ACCEPTED) {
      await this.transactionsService.paymentRequest(invoice.user.id, invoice.balance);
    }
    return this.invoicesRepository.updateEntity(id, { ...body, });
  }

  async create(fileId: number, userId: number): Promise<Invoice> {
    const user = await this.userService.readById(userId);
    const balance = await this.transactionsService.getBalance(userId);
    const invoice = await this.invoicesRepository.readEntity({
      where: { user, status: InvoicesStatusEnum.ANALYSIS, },
    });
    if (invoice) {
      throw new BadRequestException('User have processing document');
    }
    const invoicingPermissions = await this.usersDocumentsService.getInvoicingPermissions(user);
    if (!invoicingPermissions) {
      throw new ForbiddenException('User haven\'t verified document');
    }
    const file = await this.fileService.readById(fileId);
    return this.invoicesRepository.createEntity({
      file,
      user,
      status: InvoicesStatusEnum.ANALYSIS,
      balance: Math.round(balance.amount * 100),
    });
  }

  async readInvoiceById(id: number): Promise<Invoice> {
    const invoice = await this.invoicesRepository.readEntityById(id, { relations: [ 'file', 'user', ], });
    if (!invoice) {
      throw new NotFoundException('Invoice with this id was not found');
    }
    return invoice;
  }

  private getStatuses(queryStatuses: InvoicesQueryStatuses): Array<InvoicesStatusEnum> {
    type InvoicesStatus = keyof InvoicesQueryStatuses;
    const statusMap: Record<InvoicesStatus, InvoicesStatusEnum> = {
      analysisStatus: InvoicesStatusEnum.ANALYSIS,
      acceptedStatus: InvoicesStatusEnum.ACCEPTED,
      rejectedStatus: InvoicesStatusEnum.REJECTED,
    };
    return Object.keys(queryStatuses)
      .filter((status: InvoicesStatus) => queryStatuses[status] === true)
      .map((status: InvoicesStatus) => statusMap[status]);
  }
}
