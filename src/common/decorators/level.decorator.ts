import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { UserLevelEnum } from '../enums';

export const Level = (options: UserLevelEnum): CustomDecorator =>
  SetMetadata('level', options);
