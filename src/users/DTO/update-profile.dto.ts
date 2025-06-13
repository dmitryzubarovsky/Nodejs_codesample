import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { IsNullable, IsSafeInt } from '../../common/validators';

export class UpdateProfileDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nickname: string;

  @IsNullable()
  @IsInt()
  @IsPositive()
  @IsSafeInt()
  @IsNumber()
  @ApiProperty({ nullable: true, })
  avatarImageId: number;
}
