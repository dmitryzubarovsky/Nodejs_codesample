import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { User } from '../users/user.entity';
import { Pix } from '../PIX/pix.entity';

@Entity('bank_accounts')
export class BankAccount extends BaseEntity {
  @Column()
  cpf: string;

  @Column({ name: 'bank_id', })
  bankId: number;

  @Column()
  agency: string;

  @Column({ name: 'account_number', })
  accountNumber: string;

  @Column({ select: false, })
  city: string;

  @Column({ name: 'state_id', select: false, })
  stateId: number;

  @Column({ name: 'country_id', select: false, })
  countryId: number;

  @ManyToOne(() => User, user => user.bankAccount)
  @JoinColumn({ name: 'user_id', })
  user: User;

  @OneToOne(() => Pix, pix => pix.bankAccount)
  pix: Pix;
}
