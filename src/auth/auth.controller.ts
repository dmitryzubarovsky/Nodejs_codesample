import { Controller, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '../common/decorators';
import { BaseController } from '../common/base';
import { AuthService } from './auth.service';
import { AuthorizationRequestDTO, AuthorizationResponseDTO } from './DTO';
import { AuthUser } from './decorators';
import { Person } from './models';
import { AuthStrategyEnum } from '../common/enums';

@Controller('auth')
@ApiTags('Auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('user')
  @AuthGuard(AuthStrategyEnum.LOCAL_USER)
  @ApiBody({ type: AuthorizationRequestDTO, })
  @ApiCreatedResponse({ description: 'Returns user\'s token', type: AuthorizationResponseDTO, })
  authorizeUser(@AuthUser() user: Person): AuthorizationResponseDTO {
    return this.authService.authorizeUser(user);
  }

  @Post('admin')
  @AuthGuard(AuthStrategyEnum.LOCAL_ADMIN)
  @ApiBody({ type: AuthorizationRequestDTO, })
  @ApiCreatedResponse({ description: 'Returns admin\'s token', type: AuthorizationResponseDTO, })
  authorizeAdmin(@AuthUser() user: Person): AuthorizationResponseDTO {
    return this.authService.authorizeUser(user);
  }
}
