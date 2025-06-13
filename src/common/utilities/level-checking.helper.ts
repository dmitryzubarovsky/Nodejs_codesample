import { UserLevelEnum } from '../enums';
import { ForbiddenException } from '@nestjs/common';

export function checkLevel(userLevel: UserLevelEnum, contentLevel: UserLevelEnum): void {
  if (userLevel < contentLevel) {
    throw new ForbiddenException('User doesn\'t have permission to this content');
  }
}
