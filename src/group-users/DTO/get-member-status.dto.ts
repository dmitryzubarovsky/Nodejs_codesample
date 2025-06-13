import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { parseBoolean } from '../../common/utilities/parsing.helper';

export class GetMemberStatusDTO {
  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  sentStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  rejectedStatus: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(status => parseBoolean(status), { toClassOnly: true, })
  @ApiProperty()
  acceptedStatus: boolean;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, })
  search: string;
}
