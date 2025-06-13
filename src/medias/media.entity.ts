import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { Video } from '../video/video.entity';

@Entity('medias')
export class Media extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(type => Video, video => video.media)
  @JoinColumn({ name: 'video_id', })
  video: Video;
}
