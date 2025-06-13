import { IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { parseDateTime } from '../utilities';

export class OptionalTimeRangeQueryDTO {
  @Transform(date => parseDateTime(date), { toClassOnly: true, })
  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false, })
  startDate: Date;

  @Transform(date => parseDateTime(date), { toClassOnly: true, })
  @IsDate()
  @IsOptional()
  @ApiProperty({ required: false, })
  endDate: Date;
}
