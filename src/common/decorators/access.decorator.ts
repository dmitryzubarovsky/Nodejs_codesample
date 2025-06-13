import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { AccessEnum } from '../enums';

export const Access = (options: AccessEnum): CustomDecorator =>
  SetMetadata('access', options);
