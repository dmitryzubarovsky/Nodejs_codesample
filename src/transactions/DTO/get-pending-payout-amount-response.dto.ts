import { ApiProperty } from '@nestjs/swagger';

export class GetPendingPayoutAmountResponseDTO {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  usersAmount: number;

  @ApiProperty()
  paymentIdHash: string;

  @ApiProperty()
  fee: number;

  @ApiProperty()
  total: number;
}
