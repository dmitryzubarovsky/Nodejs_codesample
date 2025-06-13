import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppConfigModule } from '../common/services/app-config.module';
import { SaleStatusHistoryService } from './sale-status-history.service';
import { SaleStatusHistoryRepository } from './sale-status-history.repository';
import { SaleStatusHistory } from './sale-status-history.entity';

@Module({
  providers: [ SaleStatusHistoryService, ],
  imports: [
    TypeOrmModule.forFeature([ SaleStatusHistory, SaleStatusHistoryRepository, ]),
    AppConfigModule,
  ],
  exports: [ SaleStatusHistoryService, ],
})
export class SaleStatusHistoryModule {}
