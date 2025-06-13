import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, Module } from '@nestjs/common';

import { UserModule } from '../users/user.module';
import { TransactionsService } from './transactions.service';
import { TransactionsRepository } from './transactions.repository';
import { Transactions } from './transactions.entity';
import { TransactionsController } from './transactions.controller';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  controllers: [ TransactionsController, ],
  providers: [ TransactionsService, ],
  imports: [
    TypeOrmModule.forFeature([ Transactions, TransactionsRepository, ]),
    forwardRef(() => UserModule),
    forwardRef(() => StripeModule),
  ],
  exports: [ TransactionsService, ],
})

export class TransactionsModule {}
