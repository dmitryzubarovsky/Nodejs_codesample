import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from '../common/base';
import { Training } from '../trainings/training.entity';
import { UserLevelEnum } from '../common/enums';

@Entity('training_categories')
export class TrainingCategory extends BaseEntity {
  @Column({ name: 'title', })
  title: string;

  @Column()
  level: UserLevelEnum;

  @OneToMany(type => Training, training => training.category)
  trainings: Array<Training>;
}
