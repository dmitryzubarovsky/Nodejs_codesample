import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { TrainingCategory } from './training-category.entity';

@EntityRepository(TrainingCategory)
export class TrainingCategoryRepository extends BaseRepository<TrainingCategory> {}
