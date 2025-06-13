import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserLevelEnum } from '../enums';
import { IAuthRequest } from '../../auth/interfaces';

@Injectable()
export class LevelGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let result = true;
    const level = this.reflector.get<UserLevelEnum>('level', context.getHandler());
    if (level) {
      const { user, } = context.switchToHttp().getRequest<IAuthRequest>();
      const userLevel = await user.level;
      result = userLevel >= level;
    }
    return result;
  }
}
