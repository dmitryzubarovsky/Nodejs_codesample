import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrainingCategoryService } from './training-category.service';
import { TrainingCategoryController } from './training-category.controller';
import { TrainingCategoryRepository } from './training-category.repository';
import { TrainingCategory } from './training-category.entity';
import { TrainingModule } from '../trainings/training.module';

@Module({
  controllers: [ TrainingCategoryController, ],
  providers: [ TrainingCategoryService, ],
  imports: [
    TypeOrmModule.forFeature([ TrainingCategory, TrainingCategoryRepository, ]),
    forwardRef(() => TrainingModule),
  ],
  exports: [ TrainingCategoryService, ],
})
export class TrainingCategoryModule {}
