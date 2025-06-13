import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { OrderByEnum, Sorting } from '../../common/enums';
import { parseBoolean } from '../../common/utilities/parsing.helper';

export class ReadLeadAllDTO {
  @IsNotEmpty()
  @IsEnum(OrderByEnum)
  @ApiProperty({ enum: OrderByEnum, })
  orderBy: OrderByEnum;

  @IsNotEmpty()
  @IsEnum(Sorting)
  @IsNotEmpty()
  @ApiProperty({ enum: Sorting, })
  sorting: Sorting;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, })
  search: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  contactedStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  inNegotiationsStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  postponedStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  linkSentStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  soldStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  lostStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  newLeadStatus: boolean;
}
