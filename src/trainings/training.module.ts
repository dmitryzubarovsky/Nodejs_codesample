import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';
import { Training } from './training.entity';
import { TrainingRepository } from './training.repository';
import { TrainingCategoryModule } from '../training-categories/training-category.module';
import { VideoModule } from '../video/video.module';

@Module({
  controllers: [ TrainingController, ],
  providers: [ TrainingService, ],
  imports: [
    TypeOrmModule.forFeature([ Training, TrainingRepository, ]),
    forwardRef(() => VideoModule),
    forwardRef(() => TrainingCategoryModule),
  ],
  exports: [ TrainingService, ],
})
export class TrainingModule {}
