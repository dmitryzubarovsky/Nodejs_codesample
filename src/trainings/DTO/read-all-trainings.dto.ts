import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { IsSafeInt } from '../../common/validators';

import { parseStringToInt } from '../../common/utilities/parsing.helper';

export class ReadAllTrainingsDTO {
  @IsOptional()
  @IsPositive()
  @IsSafeInt()
  @Transform(id => parseStringToInt(id))
  @ApiProperty({ required: false, })
  categoryId: number;
}
