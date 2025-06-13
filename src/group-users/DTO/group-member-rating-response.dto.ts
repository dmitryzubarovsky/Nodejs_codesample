import { ApiProperty } from '@nestjs/swagger';
import { UserLevelEnum } from '../../common/enums';
import { BaseResponseDTO } from '../../common/base';
import { levelExamples } from '../../common/constants';

export class GroupMemberRatingResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nickname: string;

  @ApiProperty({ nullable: true, })
  avatarImageId: number;

  @ApiProperty()
  countryId: number;

  @ApiProperty()
  stateId: number;

  @ApiProperty()
  city: string;

  @ApiProperty()
  salesAmount: number;

  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;

  @ApiProperty({ enum: UserLevelEnum, })
  levelTitle: string;

  @ApiProperty()
  stars: number;
}
