import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';

export class ReadTrainingDTO extends BaseResponseDTO {
  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true, })
  description: string;

  @ApiProperty()
  videoId: number;

  @ApiProperty()
  link: string;

  @ApiProperty({ nullable: true, })
  previewImageId: number;

  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  categoryTitle: string;
}
