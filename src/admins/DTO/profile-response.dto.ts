import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { AdminRoleEnum } from '../../common/enums';
import { BaseResponseDTO } from '../../common/base';

export class ProfileResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsEnum(AdminRoleEnum)
  @ApiProperty({ enum: AdminRoleEnum, })
  role: AdminRoleEnum;

  @ApiProperty()
  lockedAt: Date;
}
