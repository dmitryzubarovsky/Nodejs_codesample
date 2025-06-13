import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { MailTokenTypeEnum } from '../common/enums';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { Admin } from '../admins/admin.entity';

@Entity('mail_tokens')
export class MailToken extends BaseEntity {
  @Column()
  token: string;

  @Column()
  type: MailTokenTypeEnum;

  @Column({ name: 'new_email', })
  newEmail: string;

  @ManyToOne(() => User, user => user.mailToken)
  @JoinColumn({ name: 'user_id', })
  user: User;

  @ManyToOne(() => Group, group => group.mailToken)
  @JoinColumn({ name: 'group_id', })
  group: Group;

  @ManyToOne(() => Admin, admin => admin.mailToken)
  @JoinColumn({ name: 'admin_id', })
  admin: Admin;
}
