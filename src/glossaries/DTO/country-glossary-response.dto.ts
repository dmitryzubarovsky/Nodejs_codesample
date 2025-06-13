import { ApiProperty } from '@nestjs/swagger';

import { BaseGlossaryResponseDTO } from './index';

export class State extends BaseGlossaryResponseDTO {
  @ApiProperty()
  code: string;
}

export class CountryGlossaryResponseDTO extends BaseGlossaryResponseDTO {
  @ApiProperty({ type: [ State, ], })
  states?: Array<State>;

  @ApiProperty()
  code: string;
}
