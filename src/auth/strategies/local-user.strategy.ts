import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthStrategyEnum } from '../../common/enums';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../models';

@Injectable()
export class LocalUserStrategy extends PassportStrategy(Strategy, AuthStrategyEnum.LOCAL_USER) {
  constructor(private readonly authService: AuthService) {
    super({ session: false, });
  }

  async validate(username: string, password: string): Promise<JwtPayload> {
    const authUser = await this.authService.validateUserCredentials(username, password);
    if (!authUser) {
      throw new ForbiddenException('Incorrect credentials');
    }
    return authUser;
  }
}
