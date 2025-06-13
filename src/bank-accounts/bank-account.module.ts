import { forwardRef, Module } from '@nestjs/common';

import { BankAccountController } from './bank-account.controller';
import { BankAccountService } from './bank-account.service';
import { UserModule } from '../users/user.module';
import { BankAccountValidator } from './bank-account.validator';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from './bank-account.entity';
import { BankAccountRepository } from './bank-account.repository';

@Module({
  controllers: [ BankAccountController, ],
  providers: [ BankAccountService, BankAccountValidator, ],
  imports: [
    TypeOrmModule.forFeature([ BankAccount, BankAccountRepository, ]),
    forwardRef(() => UserModule),
  ],
  exports: [ BankAccountService, ],
})
export class BankAccountModule {}
