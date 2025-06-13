import { IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { parseDateTime } from '../utilities';

export class TimeRangeQueryDTO {
  @Transform(date => parseDateTime(date), { toClassOnly: true, })
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  startDate: Date;

  @Transform(date => parseDateTime(date), { toClassOnly: true, })
  @IsDate()
  @IsNotEmpty()
  @ApiProperty()
  endDate: Date;
}
