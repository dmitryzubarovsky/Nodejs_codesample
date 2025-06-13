import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { Transform } from 'class-transformer';
import { parseBoolean } from '../../common/utilities/parsing.helper';

export class ReadAllUserDTO {
  @IsBoolean()
  @IsNotEmpty()
  @Transform(isReferral => parseBoolean(isReferral), { toClassOnly: true, })
  @ApiProperty({ example: false, })
  isReferral: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @Transform(invoicingPermissions => parseBoolean(invoicingPermissions), { toClassOnly: true, })
  @ApiProperty({ example: false, })
  invoicingPermissions: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, })
  search: string;
}
