import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';

import { AccessGuard, LevelGuard, RoleGuard } from '../guards';
import { AuthStrategyEnum } from '../enums';

export const AuthGuard = (strategyName: AuthStrategyEnum = AuthStrategyEnum.JWT): MethodDecorator & ClassDecorator =>
  applyDecorators(UseGuards(AuthGuardPassport(strategyName), AccessGuard, RoleGuard, LevelGuard));
