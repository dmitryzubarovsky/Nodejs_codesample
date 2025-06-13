import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { GlossaryService } from './glossary.service';
import { BaseController } from '../common/base';
import { BaseGlossaryResponseDTO, CountryGlossaryResponseDTO } from './DTO';

@Controller('glossary')
@ApiTags('Glossary')
export class GlossaryController extends BaseController {
  constructor(private readonly glossaryService: GlossaryService) {
    super();
  }

  @Get('countries')
  @ApiOkResponse({ description: 'Returns list of countries', type: [ CountryGlossaryResponseDTO, ], })
  countries(): Array<CountryGlossaryResponseDTO> {
    return this.glossaryService.getCountries();
  }

  @Get('banks')
  @ApiOkResponse({ description: 'Returns list of banks', type: [ BaseGlossaryResponseDTO, ], })
  banks(): Array<BaseGlossaryResponseDTO> {
    return this.glossaryService.getBanks();
  }
}
