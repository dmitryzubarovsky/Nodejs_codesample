import { Column, Entity, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '../common/base';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { UserImage } from '../user-images/user-image.entity';
import { GroupImage } from '../group-images/group-image.entity';

@Entity('complaints')
export class Complaint extends BaseEntity {
  @Column({ name: 'is_indecent', })
  isIndecent: boolean;

  @Column({ name: 'is_sensitive', })
  isSensitive: boolean;

  @Column({ name: 'is_rude', })
  isRude: boolean;

  @Column()
  description: string;

  @ManyToOne(() => User, user => user.complaints)
  @JoinColumn({ name: 'user_id', })
  user: User;

  @ManyToOne(() => Group, group => group.complaints)
  @JoinColumn({ name: 'group_id', })
  group: Group;

  @ManyToMany(() => UserImage, userImage => userImage.complaints)
  @JoinTable({
    name: 'content_complaints',
    joinColumn: {
      name: 'complaint_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_image_id',
      referencedColumnName: 'id',
    },
  })
  userImages: Array<UserImage>;

  @ManyToMany(() => GroupImage, groupImage => groupImage.complaints)
  @JoinTable({
    name: 'content_complaints',
    joinColumn: {
      name: 'complaint_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'group_image_id',
      referencedColumnName: 'id',
    },
  })
  groupImages: Array<GroupImage>;
}
