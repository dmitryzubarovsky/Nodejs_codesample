import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

import { parseStringToInt } from '../utilities/parsing.helper';
import { IsSafeInt } from '../validators';

export class BaseQueryDTO {
  @IsNotEmpty()
  @IsSafeInt()
  @IsPositive()
  @ApiProperty()
  @Transform(id => parseStringToInt(id))
  id: number;
}

export class BaseUserIdQueryDTO {
  @IsNotEmpty()
  @IsSafeInt()
  @IsPositive()
  @Transform(id => parseStringToInt(id))
  @ApiProperty()
  userId: number;
}
