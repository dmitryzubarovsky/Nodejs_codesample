import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { File } from '../files/file.entity';
import { User } from '../users/user.entity';
import { UserImage } from '../user-images/user-image.entity';
import { Group } from '../groups/group.entity';
import { GroupImage } from '../group-images/group-image.entity';
import { Video } from '../video/video.entity';

@Entity({ name: 'images', })
export class Image extends BaseEntity {
  @Column({ name: 'file_id', })
  fileId: number;

  @OneToOne(() => File, file => file.image)
  @JoinColumn({ name: 'file_id', })
  file: File;

  @OneToOne(() => User, user => user.avatar)
  user: User;

  @OneToOne(() => UserImage, userImage => userImage.image)
  userImage: UserImage;

  @OneToOne(() => Group, group => group.avatar)
  group: Group;

  @OneToOne(() => GroupImage, groupImage => groupImage.image)
  groupImage: GroupImage;

  @OneToMany(type => Video, video => video.previewImage)
  training: Video;
}
