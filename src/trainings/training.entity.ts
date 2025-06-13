import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { TrainingCategory } from '../training-categories/training-category.entity';
import { Video } from '../video/video.entity';
import { UserLevelEnum } from '../common/enums';

@Entity('trainings')
export class Training extends BaseEntity {
  @Column()
  level: UserLevelEnum;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(type => Video, video => video.training)
  @JoinColumn({ name: 'video_id', })
  video: Video;

  @ManyToOne(type => TrainingCategory, trainingCategory => trainingCategory.trainings)
  @JoinColumn({ name: 'category_id', })
  category: TrainingCategory;
}
