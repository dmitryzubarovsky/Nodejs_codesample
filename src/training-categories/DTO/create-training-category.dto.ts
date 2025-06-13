import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';

export class CreateTrainingCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsEnum(UserLevelEnum)
  @IsNotEmpty()
  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;
}
