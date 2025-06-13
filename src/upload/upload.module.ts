import { forwardRef, Module } from '@nestjs/common';

import { AppConfigService } from '../common/services';
import { AppConfigModule } from '../common/services/app-config.module';
import { UploadController } from './upload.controller';
import { ImageModule } from '../images/image.module';
import { FileModule } from '../files/file.module';
import { UploadService } from './upload.service';
import { MediaStorageModule } from '../media-storage/media-storage.module';
import { VideoModule } from '../video/video.module';
import { InvoiceModule } from '../invoices/invoice.module';
import { UserDocumentModule } from '../user-documents/user-document.module';

@Module({
  controllers: [ UploadController, ],
  providers: [ UploadService, AppConfigService, ],
  imports: [
    forwardRef(() => FileModule),
    forwardRef(() => ImageModule),
    AppConfigModule,
    forwardRef(() => MediaStorageModule),
    forwardRef(() => VideoModule),
    forwardRef(() => InvoiceModule),
    forwardRef(() => UserDocumentModule),
  ],
  exports: [ UploadService, ],
})
export class UploadModule {}
