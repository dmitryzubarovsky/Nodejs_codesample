import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IsGlossaryId, IsNullable } from '../../common/validators';

export class CreateBankAccountDTO {
  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  cpf: string;

  @IsNotEmpty()
  @IsGlossaryId({ context: 'bank', })
  @ApiProperty()
  bankId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  agency: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  accountNumber: string;
}
