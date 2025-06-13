import { ApiProperty } from '@nestjs/swagger';

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';

export class UpdateTrainingCategoryDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsEnum(UserLevelEnum)
  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;
}
