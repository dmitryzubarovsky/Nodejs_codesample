import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { IsSafeInt } from '../../common/validators';

export class CreateUserImageDTO {
  @IsInt()
  @IsSafeInt()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  imageId: number;
}
