import { ApiProperty } from '@nestjs/swagger';
import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';

export class GetMemberStatusResponseDTO {
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

  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;

  @ApiProperty({ enum: UserLevelEnum, })
  levelTitle: string;

  @ApiProperty()
  intStars: number;

  @ApiProperty()
  starThirds: number;
}
