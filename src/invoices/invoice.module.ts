import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../users/user.module';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { InvoiceRepository } from './invoice.repository';
import { Invoice } from './invoice.entity';
import { FileModule } from '../files/file.module';
import { UserDocumentModule } from '../user-documents/user-document.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  controllers: [ InvoiceController, ],
  providers: [ InvoiceService, ],
  imports: [
    TypeOrmModule.forFeature([ Invoice, InvoiceRepository, ]),
    UserModule,
    FileModule,
    forwardRef(() => UserDocumentModule),
    forwardRef(() => TransactionsModule),
  ],
  exports: [ InvoiceService, ],
})
export class InvoiceModule {}
