import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IAuthRequest } from '../../auth/interfaces';

@Injectable()
export class GroupAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: IAuthRequest = context.switchToHttp().getRequest();
    return !!request.user.adminGroupId;
  }
}
