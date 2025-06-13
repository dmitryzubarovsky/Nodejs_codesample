import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../common/base';

@Entity('settings')
export class Settings extends BaseEntity {
  @Column()
  name: string;

  @Column()
  value: string;
}
