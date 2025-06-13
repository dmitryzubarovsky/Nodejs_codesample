import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';

import { AuthStrategyEnum } from '../../common/enums';
import { IHottokAuthRequest } from '../interfaces';
import { CONFIG_PROVIDER_TOKEN } from '../../common/services/types';
import { AppConfigService } from '../../common/services';

@Injectable()
export class HottokStrategy extends PassportStrategy(Strategy, AuthStrategyEnum.HOTTOK) {
  constructor(
    @Inject(CONFIG_PROVIDER_TOKEN) private readonly config: AppConfigService
  ) {
    super();
  }

  validate(request: IHottokAuthRequest): boolean {
    return request.body.hottok === this.config.hottok;
  }
}
