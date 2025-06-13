import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

import { minAmountNumber } from '../constants';

export class CompoundAmountDTO {
  @Min(minAmountNumber)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;
}
