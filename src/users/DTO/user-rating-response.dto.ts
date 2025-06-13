import { ApiProperty } from '@nestjs/swagger';
import { UserLevelEnum } from '../../common/enums';
import { BaseResponseDTO } from '../../common/base';
import { levelExamples } from '../../common/constants';

export class UserRatingResponseDTO extends BaseResponseDTO {
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

  @ApiProperty({ nullable: true, })
  groupId: number;

  @ApiProperty({ nullable: true, })
  groupAvatarImageId: number;

  @ApiProperty()
  salesAmount: number;

  @ApiProperty()
  ratingNumber: number;

  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;

  @ApiProperty({ enum: UserLevelEnum, })
  levelTitle: string;

  @ApiProperty({ nullable: true, })
  stars: number;
}
