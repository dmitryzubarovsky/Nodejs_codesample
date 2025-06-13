import { ApiProperty } from '@nestjs/swagger';
import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';

export class TestLevelResponseDTO {
  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;

  @ApiProperty({ enum: UserLevelEnum, })
  levelTitle: string;

  @ApiProperty()
  intStars: number;

  @ApiProperty()
  starThirds: number;
}
