import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VideoModule } from '../video/video.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Media } from './media.entity';
import { MediaRepository } from './media.repository';

@Module({
  controllers: [ MediaController, ],
  providers: [ MediaService, ],
  imports: [
    TypeOrmModule.forFeature([ Media, MediaRepository, ]),
    forwardRef(() => VideoModule),
  ],
  exports: [ MediaService, ],
})
export class MediaModule {}
