import { Column, Entity, OneToMany } from 'typeorm';

import { AdminRoleEnum } from '../common/enums';
import { BaseEntity } from '../common/base';
import { MailToken } from '../mail-tokens/mail-token.entity';

@Entity('admins')
export class Admin extends BaseEntity {
  @Column({ name: 'full_name', })
  fullName: string;

  @Column()
  email: string;

  @Column({ select: false, })
  password: string;

  @Column()
  role: AdminRoleEnum;

  @Column({ name: 'locked_at', })
  lockedAt: Date;

  @OneToMany(() => MailToken, mailToken => mailToken.admin)
  mailToken: Array<MailToken>;
}
