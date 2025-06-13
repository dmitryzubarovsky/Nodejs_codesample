import { ApiProperty } from '@nestjs/swagger';
import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';
import { BaseResponseDTO } from '../../common/base';

export class GroupCreatorResponseDTO extends BaseResponseDTO {
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

  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;

  @ApiProperty({ enum: UserLevelEnum, })
  levelTitle: string;

  @ApiProperty()
  stars: number;
}
