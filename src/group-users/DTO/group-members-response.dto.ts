import { ApiProperty } from '@nestjs/swagger';
import { levelExamples } from '../../common/constants';
import { UserLevelEnum } from '../../common/enums';
import { BaseResponseDTO } from '../../common/base';

export class GroupMembersResponseDTO extends BaseResponseDTO {
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
