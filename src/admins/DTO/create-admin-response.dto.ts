import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { AdminRoleEnum } from '../../common/enums';

export class CreateAdminResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: AdminRoleEnum, })
  role: AdminRoleEnum;
}
