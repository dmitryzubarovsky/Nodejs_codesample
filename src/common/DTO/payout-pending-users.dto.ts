import { ApiProperty } from '@nestjs/swagger';
import { TransactionsStatusEnum } from '../enums';

export class PayoutPendingUsersDTO {
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userid: number;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: TransactionsStatusEnum, })
  status: TransactionsStatusEnum;
}
