import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';

export class TrainingResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true, })
  description: string;

  @ApiProperty()
  categoryId: number;

  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;
}
