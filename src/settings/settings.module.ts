import { forwardRef, Module } from '@nestjs/common';

import { SaleModule } from '../sales/sale.module';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from './settings.entity';
import { SettingsRepository } from './settings.repository';

@Module({
  controllers: [ SettingsController, ],
  providers: [ SettingsService, ],
  imports: [
    TypeOrmModule.forFeature([ Settings, SettingsRepository, ]),
    forwardRef(() => SaleModule),
  ],
  exports: [ SettingsService, ],
})
export class SettingsModule {}
