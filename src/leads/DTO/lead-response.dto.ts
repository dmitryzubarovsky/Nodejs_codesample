import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { LeadStatusEnum } from '../../common/enums';

export class LeadResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true, })
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ enum: LeadStatusEnum, })
  status: LeadStatusEnum;

  @ApiProperty({ nullable: true, })
  comment: string;
}
