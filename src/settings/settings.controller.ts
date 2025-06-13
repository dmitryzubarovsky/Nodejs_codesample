import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Put } from '@nestjs/common';

import { Access, AuthGuard, Roles } from '../common/decorators';
import { BaseController } from '../common/base';
import { SettingsService } from './settings.service';
import { AccessEnum, AdminRoleEnum } from '../common/enums';
import { RegistrationStatusDTO, RegistrationStatusResponseDTO } from './DTO';

@ApiBearerAuth()
@AuthGuard()
@Controller('settings')
@ApiTags('Settings')
export class SettingsController extends BaseController {
  constructor(private readonly settingsService: SettingsService) {
    super();
  }

  @ApiOkResponse({ description: 'Returns registration status', type: RegistrationStatusResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Get('registration-status')
  readRegistrationStatus(): Promise<RegistrationStatusResponseDTO> {
    return this.settingsService.readRegistrationStatus();
  }

  @ApiOkResponse({ description: 'Returns registration status', type: RegistrationStatusResponseDTO, })
  @Roles([ AdminRoleEnum.ROOT, AdminRoleEnum.GENERAL, ])
  @Access(AccessEnum.ADMIN)
  @Put('registration-status')
  toggleRegistration(@Body() body: RegistrationStatusDTO): Promise<RegistrationStatusResponseDTO> {
    return this.settingsService.toggleRegistration(body);
  }
}
