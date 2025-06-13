import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IAuthRequest } from '../../auth/interfaces';
import { AccessEnum, AdminRoleEnum } from '../enums';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    let result = true;
    const access = this.reflector.get<AccessEnum>('access', context.getHandler());
    const request: IAuthRequest = context.switchToHttp().getRequest();
    switch (access) {
    case AccessEnum.ADMIN:
      result = request.user.isAdmin;
      break;
    case AccessEnum.USER:
      result = !request.user.isAdmin;
      break;
    case AccessEnum.ROOT:
      result = request.user.isAdmin && request.user.adminRole === AdminRoleEnum.ROOT;
    }
    return result;
  }

}
