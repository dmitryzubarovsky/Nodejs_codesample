import { Module } from '@nestjs/common';

import { MediaStorageService } from './media-storage.service';
import { AppConfigModule } from '../common/services/app-config.module';

@Module({
  providers: [ MediaStorageService, ],
  imports: [ AppConfigModule, ],
  exports: [ MediaStorageService, ],
})
export class MediaStorageModule {}
