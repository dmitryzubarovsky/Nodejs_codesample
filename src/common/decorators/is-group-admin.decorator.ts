import { applyDecorators, UseGuards } from '@nestjs/common';
import { GroupAdminGuard } from '../guards';

export const IsGroupAdmin = (): MethodDecorator & ClassDecorator =>
  applyDecorators(UseGuards(GroupAdminGuard));
