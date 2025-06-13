import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

import { parseStringToInt } from '../utilities/parsing.helper';

export class BaseFileDTO {
  @IsNotEmpty()
  @Transform(id => parseStringToInt(id))
  @ApiProperty()
  fileId: number;
}
