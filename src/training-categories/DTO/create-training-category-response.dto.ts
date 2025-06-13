import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { BaseResponseDTO } from '../../common/base';
import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';

export class CreateTrainingCategoryResponseDTO extends BaseResponseDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsEnum(UserLevelEnum)
  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;
}
