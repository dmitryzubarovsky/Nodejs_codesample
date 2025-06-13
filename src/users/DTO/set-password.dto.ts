import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { TokenDTO } from '../../common/DTO';
import { IsStrongPassword } from '../../common/validators';

export class SetPasswordDTO extends TokenDTO {
  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
