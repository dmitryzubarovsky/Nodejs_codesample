import { ApiProperty } from '@nestjs/swagger';

import { LeadStatusEnum } from '../../common/enums';
import { BaseResponseDTO } from '../../common/base';

export class LeadAllResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true, })
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty({ enum: LeadStatusEnum, })
  status: LeadStatusEnum;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  userName: string;

  @ApiProperty({ nullable: true, })
  comment: string;
}
