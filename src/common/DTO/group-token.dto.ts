import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GroupTokenDTO {
  @ApiProperty()
  @IsString()
  token: string;
}
