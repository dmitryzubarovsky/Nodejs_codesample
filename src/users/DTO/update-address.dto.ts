import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { IsGlossaryId, IsNullable, IsSubGlossaryId } from '../../common/validators';

export class UpdateAddressDTO {
  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  zip: string;

  @IsNotEmpty()
  @IsGlossaryId({ context: 'country', })
  @ApiProperty()
  countryId: number;

  @IsNullable()
  @IsSubGlossaryId('countryId', { context: 'state', })
  @ApiProperty({ nullable: true, })
  stateId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;

  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  district: string;

  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  street: string;

  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  house: string;

  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  apartment: string;
}
