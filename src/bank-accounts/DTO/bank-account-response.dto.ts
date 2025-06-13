import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class BankAccountResponseDTO extends BaseResponseDTO {
  @ApiProperty({ nullable: true, })
  cpf: string;

  @ApiProperty({ nullable: true, })
  bankId: number;

  @ApiProperty({ nullable: true, })
  agency: string;

  @ApiProperty({ nullable: true, })
  accountNumber: string;
}
