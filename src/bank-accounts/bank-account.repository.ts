import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { BankAccount } from './bank-account.entity';

@EntityRepository(BankAccount)
export class BankAccountRepository extends BaseRepository<BankAccount> {}
