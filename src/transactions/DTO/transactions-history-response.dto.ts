import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { TransactionsStatusEnum } from '../../common/enums';

export class TransactionsHistoryResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: TransactionsStatusEnum, })
  status: TransactionsStatusEnum;
}
