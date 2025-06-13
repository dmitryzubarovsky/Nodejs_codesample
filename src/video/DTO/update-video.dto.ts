import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateVideoDTO {
  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  previewImageId: number;
}
