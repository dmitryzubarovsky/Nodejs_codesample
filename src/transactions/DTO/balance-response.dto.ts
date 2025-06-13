import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponseDTO {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;
}
