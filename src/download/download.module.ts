import { forwardRef, Module } from '@nestjs/common';

import { AppConfigService } from '../common/services';
import { AppConfigModule } from '../common/services/app-config.module';
import { DownloadController } from './download.controller';
import { DownloadService } from './download.service';
import { ImageModule } from '../images/image.module';
import { FileModule } from '../files/file.module';
import { MediaStorageModule } from '../media-storage/media-storage.module';
import { InvoiceModule } from '../invoices/invoice.module';
import { UserDocumentModule } from '../user-documents/user-document.module';

@Module({
  controllers: [ DownloadController, ],
  providers: [ DownloadService, AppConfigService, ],
  imports: [
    forwardRef(() => FileModule),
    forwardRef(() => ImageModule),
    AppConfigModule,
    forwardRef(() => InvoiceModule),
    forwardRef(() => MediaStorageModule),
    forwardRef(() => UserDocumentModule),
  ],
})
export class DownloadModule {}
