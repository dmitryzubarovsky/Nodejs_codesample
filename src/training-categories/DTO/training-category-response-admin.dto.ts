import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';

export class TrainingCategoryResponseAdminDTO extends BaseResponseDTO {
  @ApiProperty()
  title: string;

  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;
}
