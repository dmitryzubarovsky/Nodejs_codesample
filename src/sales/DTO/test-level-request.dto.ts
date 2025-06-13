import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class TestLevelRequestDTO {
  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  numberOfSales: number;

  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  weeksAgo: number;
}
