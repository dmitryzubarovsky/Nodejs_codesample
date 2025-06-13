import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { LeadStatusEnum } from '../common/enums';
import { User } from '../users/user.entity';

@Entity('leads')
export class Lead extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ name: 'phone_number', })
  phoneNumber: string;

  @Column()
  status: LeadStatusEnum;

  @Column()
  comment: string;

  @ManyToOne(() => User, user => user.leads)
  @JoinColumn({ name: 'user_id', })
  user: User;
}
