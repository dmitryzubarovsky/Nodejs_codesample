import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OrderByEnum, Sorting } from '../../common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { parseBoolean } from '../../common/utilities/parsing.helper';

export class GetAllDocumentsDTO {
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
  verifiedStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  processingStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  notVerifiedStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  notLoaded: boolean;
}
