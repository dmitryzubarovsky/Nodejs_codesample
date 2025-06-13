import { ApiProperty } from '@nestjs/swagger';

import { TransactionsHistoryResponseDTO } from './index';

export class TransactionsHistoryForUserResponseDTO extends TransactionsHistoryResponseDTO {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;
}
