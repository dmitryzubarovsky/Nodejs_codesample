import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { Image } from '../images/image.entity';
import { BaseEntity } from '../common/base';
import { GroupUsers } from '../group-users/group-users.entity';
import { Complaint } from '../complaints/complaint.entity';
import { MailToken } from '../mail-tokens/mail-token.entity';

@Entity('groups')
export class Group extends BaseEntity {
  @Column({ name: 'blocked_at', })
  blockedAt: Date;

  @Column()
  name: string;

  @OneToOne(() => Image, image => image.group)
  @JoinColumn({ name: 'avatar_image_id', })
  avatar: Image;

  @Column({ name: 'avatar_image_id', })
  avatarImageId: number;

  @OneToMany(() => GroupUsers, groupUsers => groupUsers.group)
  groupUsers: GroupUsers;

  @OneToMany(() => Complaint, complaint => complaint.group)
  complaints: Array<Complaint>;

  @OneToMany(() => MailToken, mailToken => mailToken.group)
  mailToken: Array<MailToken>;
}
