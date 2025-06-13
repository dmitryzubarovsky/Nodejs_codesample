import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Person } from '../auth/models';

import { BankAccountResponseDTO, CreateBankAccountDTO } from './DTO';
import { BankAccountValidator } from './bank-account.validator';
import { BankAccountRepository } from './bank-account.repository';
import { UserService } from '../users/user.service';
import { BankAccount } from './bank-account.entity';
import { PixBankAccount } from './common/types';
import { BaseMessageDTO } from '../common/base';
import { User } from '../users/user.entity';

@Injectable()
export class BankAccountService {
  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
    private readonly bankAccountValidator: BankAccountValidator,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) { }

  async create(person: Person, body: CreateBankAccountDTO): Promise<BankAccountResponseDTO> {
    this.bankAccountValidator.validate(body);
    const user = await this.userService.readById(person.userId);
    const existsBankAccount = await this.getBankAccountByUser(user);
    if (existsBankAccount) {
      throw new BadRequestException('Bank account already exists');
    }
    return this.bankAccountRepository.createEntity({ user, ...body, });
  }

  async update(person: Person, body: CreateBankAccountDTO): Promise<BankAccountResponseDTO> {
    this.bankAccountValidator.validate(body);
    const user = await this.userService.readById(person.userId);
    const bankAccount = await this.getBankAccountByUser(user);
    return this.bankAccountRepository.updateEntity(bankAccount.id, { user, ...body, });
  }

  async createOrUpdateForPix(body: PixBankAccount, bankAccountId?: number): Promise<BankAccount> {
    let bankAccount;
    if (bankAccountId) {
      bankAccount = await this.bankAccountRepository.updateEntity(bankAccountId, { ...body, });
    } else {
      bankAccount = await this.bankAccountRepository.createEntity({ ...body, });
    }
    return this.getBankAccountByIdForPix(bankAccount.id);
  }

  async read(userId: number): Promise<BankAccountResponseDTO> {
    const user = await this.userService.readById(userId);
    const bankAccount = await this.getBankAccountByUser(user);
    return bankAccount ?? null;
  }

  async readById(id: number): Promise<BankAccountResponseDTO> {
    const { user, ...bankAccount } = await this.getBankAccountById(id, [ 'user', ]);
    if (!user) {
      throw new NotFoundException('Bank account with this id not found.');
    }
    return bankAccount;
  }

  async delete(userId: number): Promise<BaseMessageDTO> {
    const user = await this.userService.readById(userId);
    const bankAccount = await this.getBankAccountByUser(user, true);
    await this.bankAccountRepository.softDeleteEntity(bankAccount.id);
    return { message: 'The entity was successfully deleted', };
  }

  async getBankAccountByIdForPix(id: number, relations?: Array<string>): Promise<BankAccount> {
    const bankAccount = await this.bankAccountRepository.readEntityById(id, { select: [
      'cpf',
      'bankId',
      'agency',
      'accountNumber',
      'city',
      'stateId',
      'countryId',
    ], relations, });
    if (!bankAccount) {
      throw new NotFoundException('Bank account with this id not found.');
    }
    return bankAccount;
  }

  async deleteForPix(id: number): Promise<void> {
    await this.bankAccountRepository.softDeleteEntity(id);
  }

  private async getBankAccountById(id: number, relations?: Array<string>): Promise<BankAccount> {
    let options;
    if (relations) {
      options = { relations, };
    }
    const bankAccount = await this.bankAccountRepository.readEntityById(id, options);
    if (!bankAccount) {
      throw new NotFoundException('Bank account with this id not found.');
    }
    return bankAccount;
  }

  private async getBankAccountByUser(user: User, exception?: boolean): Promise<BankAccount> {
    const bankAccount = await this.bankAccountRepository.readEntity({ where: { user, }, });
    if (exception && !bankAccount) {
      throw new NotFoundException('Bank account not found.');
    }
    return bankAccount;
  }
}
