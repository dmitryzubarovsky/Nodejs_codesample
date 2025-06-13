import { Injectable } from '@nestjs/common';

import { SaleStatusHistoryRepository } from './sale-status-history.repository';
import type { Sale } from '../sales/sale.entity';
import type { SaleStatusHistory } from './sale-status-history.entity';

@Injectable()
export class SaleStatusHistoryService {
  constructor(
    private readonly saleStatusHistoryRepository: SaleStatusHistoryRepository
  ) { }

  create(status: string, sale: Sale): Promise<SaleStatusHistory> {
    return this.saleStatusHistoryRepository.createEntity({ sale, status, });
  }

  getHistoryBySale(sale: Sale): Promise<Array<SaleStatusHistory>> {
    return this.saleStatusHistoryRepository.readAllEntities({ where: { sale, }, order: { createdAt: 'DESC', }, });
  }
}
