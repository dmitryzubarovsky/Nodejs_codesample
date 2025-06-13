import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { User } from '../users/user.entity';
import { Image } from '../images/image.entity';
import { Complaint } from '../complaints/complaint.entity';

@Entity('user_images')
export class UserImage extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', })
  user: User;

  @OneToOne(() => Image, image => image.userImage)
  @JoinColumn({ name: 'image_id', })
  image: Image;

  @ManyToMany(() => Complaint, complaint => complaint.userImages)
  complaints: Array<Complaint>;

  @Column({ name: 'image_id', })
  imageId: number;
}
