import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

import { toLowerCase } from '../../common/utilities/string.helper';

export class ConfirmEmailDTO {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  token: string;

  @IsNotEmpty()
  @IsString()
  @Transform(status => toLowerCase(status), { toClassOnly: true, })
  @ApiProperty()
  email: string;
}
