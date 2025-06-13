import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { Video } from './video.entity';
import { VideoRepository } from './video.repository';
import { ImageModule } from '../images/image.module';
import { MediaModule } from '../medias/media.module';
import { TrainingModule } from '../trainings/training.module';

@Module({
  controllers: [ VideoController, ],
  providers: [ VideoService, ],
  imports: [
    TypeOrmModule.forFeature([ Video, VideoRepository, ]),
    forwardRef(() => ImageModule),
    forwardRef(() => MediaModule),
    forwardRef(() => TrainingModule),
  ],
  exports: [ VideoService, ],
})
export class VideoModule {}
