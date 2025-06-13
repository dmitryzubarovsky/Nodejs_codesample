import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '../common/base';
import { Image } from '../images/image.entity';
import { Training } from '../trainings/training.entity';
import { Media } from '../medias/media.entity';

@Entity('videos')
export class Video extends BaseEntity {
  @Column({ name: 'third_party_video_id', })
  thirdPartyVideoId: string;

  @Column({ name: 'preview_image_id', })
  previewImageId: number;

  @ManyToOne(() => Image)
  @JoinColumn({ name: 'preview_image_id', })
  previewImage: Image;

  @OneToMany(type => Training, training => training.video)
  training: Training;

  @OneToMany(type => Media, media => media.video)
  media: Media;
}
