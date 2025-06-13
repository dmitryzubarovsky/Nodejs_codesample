import { ApiProperty } from '@nestjs/swagger';

import { WeekEnum } from '../enums';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class WeekQueryDTO {
  @IsEnum(WeekEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: WeekEnum, })
  week: WeekEnum;
}
