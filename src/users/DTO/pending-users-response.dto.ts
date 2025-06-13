import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class ReferDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nickname: string;
}

export class PendingUsersResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  countryId: number;

  @ApiProperty()
  stateId: number;

  @ApiProperty()
  city: string;

  @ApiProperty({ type: ReferDTO, nullable: true, })
  refer: ReferDTO;
}
