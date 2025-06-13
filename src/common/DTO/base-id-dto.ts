import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

import { IsSafeInt } from '../validators';
import { parseStringToInt } from '../utilities/parsing.helper';

export class BaseIdDTO {
  @IsNotEmpty()
  @IsSafeInt()
  @IsPositive()
  @Transform(id => parseStringToInt(id))
  @ApiProperty()
  id: number;
}
