import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString
} from 'class-validator';
import { Transform } from 'class-transformer';

import { IsGlossaryId, IsNullable, IsSubGlossaryId, IsValidPhoneNumber } from '../../common/validators';
import { convertPhoneNumber } from '../../common/utilities';
import { toLowerCase } from '../../common/utilities/string.helper';

export class RegisterDTO {
  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  referCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(status => toLowerCase(status), { toClassOnly: true, })
  @ApiProperty()
  email: string;

  @Transform(phone => convertPhoneNumber(phone), { toClassOnly: true, })
  @IsValidPhoneNumber()
  @ApiProperty()
  phoneNumber: string;

  @IsGlossaryId({ context: 'country', })
  @IsNotEmpty()
  @ApiProperty()
  countryId: number;

  @IsSubGlossaryId('countryId', { context: 'state', })
  @IsNullable()
  @ApiProperty({ nullable: true, })
  stateId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  city: string;
}
