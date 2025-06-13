import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { CONFIG_PROVIDER_TOKEN } from './types';
import { AppConfigService } from './config/app-config.service';
import { LoggerService, TypeormLoggerService, VimeoService, CryptographerServices, StripeApiService } from './index';

const config = new AppConfigService();

export const configProvider = {
  provide: CONFIG_PROVIDER_TOKEN,
  useFactory: config.init,
};

@Global()
@Module({
  providers: [ configProvider, LoggerService, TypeormLoggerService, VimeoService, CryptographerServices, StripeApiService, ],
  imports: [ NestConfigModule, ],
  exports: [ configProvider, LoggerService, TypeormLoggerService, VimeoService, CryptographerServices, StripeApiService, ],
})
export class AppConfigModule {}
