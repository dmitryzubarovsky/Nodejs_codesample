import { ApiProperty } from '@nestjs/swagger';

import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';

export class GroupRatingResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  groupName: string;

  @ApiProperty({ nullable: true, })
  groupAvatarImageId: number;

  @ApiProperty()
  creatorId: number;

  @ApiProperty()
  creatorName: string;

  @ApiProperty()
  creatorNickname: string;

  @ApiProperty()
  salesAmount: number;

  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;

  @ApiProperty({ enum: UserLevelEnum, })
  levelTitle: string;

  @ApiProperty()
  stars: number;

  @ApiProperty()
  ratingNumber: number;
}
