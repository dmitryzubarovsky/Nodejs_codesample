import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';
import { IsStrongPassword } from '../validators';

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  currentPassword: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;
}
