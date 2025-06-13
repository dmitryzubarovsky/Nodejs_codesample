import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

import { parseStringToInt } from '../../common/utilities/parsing.helper';

export class InvoiceIdDTO {
  @IsNotEmpty()
  @Transform(id => parseStringToInt(id))
  @ApiProperty()
  invoiceId: number;
}
