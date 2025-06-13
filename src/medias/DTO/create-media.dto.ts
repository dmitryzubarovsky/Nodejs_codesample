import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateMediaDTO {
  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  videoId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
