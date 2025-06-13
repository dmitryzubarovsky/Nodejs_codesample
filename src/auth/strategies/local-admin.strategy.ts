import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthStrategyEnum } from '../../common/enums';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../models';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(Strategy, AuthStrategyEnum.LOCAL_ADMIN) {
  constructor(private readonly authService: AuthService) {
    super({ session: false, });
  }

  async validate(username: string, password: string): Promise<JwtPayload> {
    const authUser = await this.authService.validateAdminCredentials(username, password);
    if (!authUser) {
      throw new ForbiddenException('Incorrect credentials');
    }
    return authUser;
  }
}
