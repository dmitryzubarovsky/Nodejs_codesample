import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { AdminRoleEnum } from '../../common/enums';

export class CreateAdminDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsEnum(AdminRoleEnum)
  @ApiProperty({ enum: AdminRoleEnum, })
  role: AdminRoleEnum;
}
