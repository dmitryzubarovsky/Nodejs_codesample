import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { IsNullable } from '../../common/validators';

export class UpdateGroupDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNullable()
  @IsInt()
  @IsPositive()
  @IsNumber()
  @ApiProperty({ nullable: true, })
  avatarImageId: number;
}
