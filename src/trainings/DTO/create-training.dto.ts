import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';
import { IsNullable } from '../../common/validators';

export class CreateTrainingDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNullable()
  @IsString()
  @ApiProperty({ nullable: true, })
  description: string;

  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  videoId: number;

  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  categoryId: number;

  @IsEnum(UserLevelEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;
}
