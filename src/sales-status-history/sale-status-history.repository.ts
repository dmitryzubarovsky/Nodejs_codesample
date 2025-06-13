import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { SaleStatusHistory } from './sale-status-history.entity';

@EntityRepository(SaleStatusHistory)
export class SaleStatusHistoryRepository extends BaseRepository<SaleStatusHistory> {}
