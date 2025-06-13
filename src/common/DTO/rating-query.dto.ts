import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { parseStringToInt } from '../utilities/parsing.helper';
import { IsExtendedNatural, IsSafeInt } from '../validators';

export class RatingQueryDTO {
  @IsOptional()
  @IsExtendedNatural()
  @IsInt()
  @IsSafeInt()
  @Transform(salesFrom => parseStringToInt(salesFrom))
  @ApiProperty({ required: false, })
  salesFrom?: number;

  @IsOptional()
  @IsExtendedNatural()
  @IsInt()
  @IsSafeInt()
  @Transform(salesTo => parseStringToInt(salesTo))
  @ApiProperty({ required: false, })
  salesTo?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, })
  search?: string;
}
