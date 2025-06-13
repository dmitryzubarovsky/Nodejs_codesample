import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeORMOptionsFactory } from './common/factories';
import { AppConfigModule } from './common/services/app-config.module';
import { AppConfigService } from './common/services';
import { UserModule } from './users/user.module';
import { FileModule } from './files/file.module';
import { ImageModule } from './images/image.module';
import { UserImageModule } from './user-images/user-image.module';
import { GroupModule } from './groups/group.module';
import { GroupImageModule } from './group-images/group-image.module';
import { SaleModule } from './sales/sale.module';
import { UploadModule } from './upload/upload.module';
import { DownloadModule } from './download/download.module';
import { AuthModule } from './auth/auth.module';
import { InitLoggerMiddleware } from './common/middleware/init-logger.middleware';
import { AdminModule } from './admins/admin.module';
import { MailModule } from './mail/mail.module';
import { GlossaryModule } from './glossaries/glossary.module';
import { MediaModule } from './medias/media.module';
import { MediaStorageModule } from './media-storage/media-storage.module';
import { TrainingCategoryModule } from './training-categories/training-category.module';
import { VideoModule } from './video/video.module';
import { TrainingModule } from './trainings/training.module';
import { HotmartModule } from './hotmart/hotmart.module';
import { LeadModule } from './leads/lead.module';
import { ComplaintModule } from './complaints/complaint.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SettingsModule } from './settings/settings.module';
import { HttpExceptionFilter } from './common/filters';
import { StripeModule } from './stripe/stripe.module';
import { MailTokenModule } from './mail-tokens/mail-token.module';
import { InvoiceModule } from './invoices/invoice.module';
import { UserDocumentModule } from './user-documents/user-document.module';
import { PixModule } from './PIX/pix.module';
import { BankAccountModule } from './bank-accounts/bank-account.module';
import { SaleStatusHistoryModule } from './sales-status-history/sale-status-history.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ AppConfigModule, ],
      inject: [ AppConfigService, ],
      useClass: TypeORMOptionsFactory,
    }),
    AuthModule,
    UserModule,
    BankAccountModule,
    FileModule,
    ImageModule,
    UserImageModule,
    GroupModule,
    GroupImageModule,
    GlossaryModule,
    SaleModule,
    UploadModule,
    MailModule,
    DownloadModule,
    AdminModule,
    MediaModule,
    MediaStorageModule,
    TrainingCategoryModule,
    TransactionsModule,
    VideoModule,
    TrainingModule,
    HotmartModule,
    PixModule,
    LeadModule,
    ComplaintModule,
    SettingsModule,
    StripeModule,
    MailTokenModule,
    InvoiceModule,
    UserDocumentModule,
    SaleStatusHistoryModule,
  ],
  controllers: [ AppController, ],
  providers: [
    AppService,
    AppConfigService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(InitLoggerMiddleware)
      .forRoutes('/');
  }
}
