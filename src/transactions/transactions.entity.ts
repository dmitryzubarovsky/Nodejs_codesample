import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { User } from '../users/user.entity';
import { TransactionsStatusEnum, TransactionsTypeEnum } from '../common/enums';
import { StripePayments } from '../stripe/stripe-payments.entity';
import { Sale } from '../sales/sale.entity';

@Entity('transactions')
export class Transactions extends BaseEntity {
  @Column()
  amount: number;

  @Column()
  type: TransactionsTypeEnum;

  @Column()
  currency: string;

  @Column()
  status: TransactionsStatusEnum;

  @Column({ name: 'transfer_id', })
  transferId: string;

  @Column({ name: 'is_leader', select: false, })
  isLeader: boolean;

  @ManyToOne(() => StripePayments)
  @JoinColumn({ name: 'stripe_payment_id', })
  stripePayment: StripePayments;

  @ManyToOne(() => Sale)
  @JoinColumn({ name: 'sale_id', })
  sale: Sale;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', })
  user: User;
}
