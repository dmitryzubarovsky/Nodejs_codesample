import { JwtModuleOptions } from '@nestjs/jwt';
import { Inject, Injectable } from '@nestjs/common';
import { JwtOptionsFactory } from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface';

import { CONFIG_PROVIDER_TOKEN } from '../../common/services/types';
import { AppConfigService } from '../../common/services';

@Injectable()
export class JWTOptionsFactory implements JwtOptionsFactory {
  constructor(
      @Inject(CONFIG_PROVIDER_TOKEN) private readonly config: AppConfigService
  ) { }

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    return {
      secret: this.config.jwtSecret,
      signOptions: {
        expiresIn: this.config.jwtExpires,
      },
    };
  }
}
