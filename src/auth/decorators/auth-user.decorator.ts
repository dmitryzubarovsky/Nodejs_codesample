import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Person } from '../models';
import { IAuthRequest } from '../interfaces';

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext): Person => {
  return ctx.switchToHttp().getRequest<IAuthRequest>().user;
});
