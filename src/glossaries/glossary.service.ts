import { Injectable } from '@nestjs/common';

import {
  country,
  bank
} from '../../data';
import {
  BaseGlossaryResponseDTO,
  CountryGlossaryResponseDTO
} from './DTO';

@Injectable()
export class GlossaryService {
  getCountries(): Array<CountryGlossaryResponseDTO> {
    return country;
  }

  getBanks(): Array<BaseGlossaryResponseDTO> {
    return bank;
  }
}
