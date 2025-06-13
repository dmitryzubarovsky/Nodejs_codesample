import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IAuthRequest } from '../../auth/interfaces';
import { AdminRoleEnum } from '../enums';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Array<AdminRoleEnum>>('roles', context.getHandler());
    const request: IAuthRequest = context.switchToHttp().getRequest();
    return !roles || roles.includes(request.user.adminRole);
  }
}
