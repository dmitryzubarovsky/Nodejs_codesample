import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageService } from './image.service';
import { ImageRepository } from './image.repository';
import { FileModule } from '../files/file.module';
import { Image } from './image.entity';

@Module({
  controllers: [],
  providers: [ ImageService, ],
  imports: [
    TypeOrmModule.forFeature([ Image, ImageRepository, ]),
    forwardRef(() => FileModule),
  ],
  exports: [ ImageService, ],
})
export class ImageModule {}
