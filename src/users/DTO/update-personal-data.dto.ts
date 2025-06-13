import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsString, MaxLength } from 'class-validator';
import { maxLenghtForWide, maxLenghtForShort } from '../../common/constants';
import { IsNullable, IsPastDate } from '../../common/validators';

export class UpdatePersonalDataDTO {
  @IsNullable()
  @IsString()
  @MaxLength(maxLenghtForShort)
  @ApiProperty({ nullable: true, })
  profession: string;

  @IsNullable()
  @IsISO8601()
  @IsPastDate()
  @ApiProperty({ nullable: true, })
  birthDate: Date;

  @IsNullable()
  @IsString()
  @MaxLength(maxLenghtForWide)
  @ApiProperty({ nullable: true, })
  about: string;
}
