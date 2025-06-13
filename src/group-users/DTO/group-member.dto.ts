import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GroupMemberDTO {
  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  groupId: number;
}
