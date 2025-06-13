import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { Group } from '../groups/group.entity';
import { Image } from '../images/image.entity';
import { Complaint } from '../complaints/complaint.entity';

@Entity('group_images')
export class GroupImage extends BaseEntity {
  @OneToOne(() => Image, image => image.groupImage)
  @JoinColumn({ name: 'image_id', })
  image: Image;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id', })
  group: Group;

  @ManyToMany(() => Complaint, complaint => complaint.groupImages)
  complaints: Array<Complaint>;

  @Column({ name: 'image_id', })
  imageId: number;
}
