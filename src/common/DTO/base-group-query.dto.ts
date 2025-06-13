import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';
import { parseStringToInt } from '../utilities/parsing.helper';
import { IsSafeInt } from '../validators';

export class BaseGroupQueryDTO {
  @IsNotEmpty()
  @IsSafeInt()
  @IsPositive()
  @Transform(id => parseStringToInt(id))
  @ApiProperty()
  groupId: number;
}
