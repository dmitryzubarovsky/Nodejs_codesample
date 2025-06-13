import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { OrderByEnum, Sorting } from '../../common/enums';

export class ReadGroupMembersForUserDTO {
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
}
