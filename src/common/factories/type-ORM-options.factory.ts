import { Inject, Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';

import { CONFIG_PROVIDER_TOKEN } from '../services/types';
import { AppConfigService, TypeormLoggerService } from '../services';
import { EnvironmentName } from '../enums';

@Injectable()
export class TypeORMOptionsFactory implements TypeOrmOptionsFactory {
  constructor(
    @Inject(CONFIG_PROVIDER_TOKEN) private readonly config: AppConfigService,
    private readonly typeormLoggerService: TypeormLoggerService
  ) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isDebugMod = this.config.environment === EnvironmentName.DEV || this.config.environment === EnvironmentName.LOCAL;
    return {
      type: 'postgres',
      host: this.config.dbConfig.host,
      port: this.config.dbConfig.port,
      username: this.config.dbConfig.username,
      password: this.config.dbConfig.password,
      database: this.config.dbConfig.name,
      synchronize: false,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      logger: isDebugMod ? this.typeormLoggerService : undefined,
    };
  }
}
