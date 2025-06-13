import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { v4 } from 'uuid';

import { AppConfigService, LoggerService, RequestMetadata } from '../services';
import { IInitLogger } from './init-logger.interface';
import { CONFIG_PROVIDER_TOKEN } from '../services/types';
import { EnvironmentName } from '../enums';

@Injectable()
export class InitLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly logger: LoggerService,
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly config: AppConfigService
  ) {
  }

  use(req: IInitLogger, res: Response, next: NextFunction): void {
    const { body, query, params, method, } = req;
    const pathname = req._parsedUrl.pathname;
    const context = `[${method}] ${pathname}`;
    const requestId = v4();
    const requestMetadata = RequestMetadata.getInstance();
    requestMetadata.metadata = { context, requestId, };
    const logData = { body, query, params, };
    if (this.config.environment === EnvironmentName.PROD && logData?.body?.password) {
      logData.body = { ...body, password: '******', };
    }
    this.logger.debug('Start request', logData);
    next();
  }
}
