import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength
} from 'class-validator';
import { IsNullable } from '../../common/validators';
import { maxLenghtForShort, maxLenghtForWide } from '../../common/constants';

import { LeadStatusEnum } from '../../common/enums';
import { convertPhoneNumber } from '../../common/utilities';
import { toLowerCase } from '../../common/utilities/string.helper';

export class CreateLeadDTO {
  @IsString()
  @MaxLength(maxLenghtForShort)
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNullable()
  @IsEmail()
  @Transform(status => toLowerCase(status), { toClassOnly: true, })
  @ApiProperty({ nullable: true, })
  email: string;

  @IsPhoneNumber('BR')
  @IsString()
  @IsNotEmpty()
  @Transform(phone => convertPhoneNumber(phone), { toClassOnly: true, })
  @ApiProperty()
  phoneNumber: string;

  @IsEnum(LeadStatusEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: LeadStatusEnum, })
  status: LeadStatusEnum;

  @IsNullable()
  @IsString()
  @MaxLength(maxLenghtForWide)
  @ApiProperty({ nullable: true, })
  comment: string;
}
