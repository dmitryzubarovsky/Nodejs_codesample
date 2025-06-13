import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

import { toLowerCase } from '../utilities/string.helper';

export class EmailDTO {
  @IsNotEmpty()
  @IsEmail()
  @Transform(status => toLowerCase(status), { toClassOnly: true, })
  @ApiProperty()
  email: string;
}
