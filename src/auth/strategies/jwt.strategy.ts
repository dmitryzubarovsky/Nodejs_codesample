import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppConfigService } from '../../common/services';
import { CONFIG_PROVIDER_TOKEN } from '../../common/services/types';
import { JwtPayload, Person } from '../models';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CONFIG_PROVIDER_TOKEN) private readonly config: AppConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  validate(payload: JwtPayload): Promise<Person> {
    return this.authService.validatePerson(payload);
  }
}
