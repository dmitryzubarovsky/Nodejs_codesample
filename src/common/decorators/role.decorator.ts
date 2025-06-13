import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { AdminRoleEnum } from '../enums';

export const Roles = (options: Array<AdminRoleEnum>): CustomDecorator =>
  SetMetadata('roles', options);
