import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { User } from '../users/user.entity';
import { Sale } from '../sales/sale.entity';

@Entity('sales_status_history')
export class SaleStatusHistory extends BaseEntity {
  @Column()
  status: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sale_id', })
  sale: Sale;
}
