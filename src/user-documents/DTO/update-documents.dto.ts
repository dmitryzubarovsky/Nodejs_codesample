import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNullable } from '../../common/validators';
import { UsersDocumentsStatusForUpdate } from '../common/enums';
import { UsersDocumentsStatus } from '../../common/enums';

export class UpdateDocumentsDTO {
  @IsEnum(UsersDocumentsStatus)
  @IsNotEmpty()
  @ApiProperty({ enum: UsersDocumentsStatusForUpdate, })
  status: UsersDocumentsStatus;

  @IsString()
  @IsNullable()
  @ApiProperty({ nullable: true, })
  comment: string;
}
