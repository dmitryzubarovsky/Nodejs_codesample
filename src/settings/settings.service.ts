import { Inject, Injectable } from '@nestjs/common';

import { BooleanEnum, UserLevelEnum } from '../common/enums';

import type { RegistrationStatusDTO, RegistrationStatusResponseDTO } from './DTO';
import { AppConfigService } from '../common/services';
import { CONFIG_PROVIDER_TOKEN } from '../common/services/types';
import { SettingsRepository } from './settings.repository';
import { SettingsEnum } from './enums';

@Injectable()
export class SettingsService {
  constructor( private readonly settingsRepository: SettingsRepository,
              @Inject(CONFIG_PROVIDER_TOKEN)
              private readonly config: AppConfigService
  ) {}

  async readRegistrationStatus(): Promise<RegistrationStatusResponseDTO> {
    const registrationStatus = await this.settingsRepository.readEntity({ where: { name: SettingsEnum.REGISTRATION_STATUS, }, });
    if (!registrationStatus?.value) {
      await this.settingsRepository.createEntity({ name: SettingsEnum.REGISTRATION_STATUS, value: BooleanEnum.TRUE, });
      return { registrationStatus: true, };
    }
    return { registrationStatus: registrationStatus.value === BooleanEnum.TRUE, };
  }

  async toggleRegistration(body: RegistrationStatusDTO): Promise<RegistrationStatusResponseDTO> {
    const registrationStatus = await this.settingsRepository.readEntity({ where: { name: SettingsEnum.REGISTRATION_STATUS, }, });
    const result = typeof registrationStatus.value ? body.registrationStatus : false;
    await this.settingsRepository.update({ name: SettingsEnum.REGISTRATION_STATUS, },
      { value: result ? BooleanEnum.TRUE : BooleanEnum.FALSE, });
    return { registrationStatus: result, };
  }

  getStarPrice(level: UserLevelEnum): number {
    return this.config.salesSetting.levelStarThreshold[level].starPrice;
  }

  getCommission(level: UserLevelEnum): { starPrice: number, direct: number, indirect: number, } {
    return this.config.salesSetting.levelStarThreshold[level];
  }
}
