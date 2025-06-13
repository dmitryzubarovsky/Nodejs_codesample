import { ApiProperty } from '@nestjs/swagger';
import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';

export class UserLevelResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  stars: number;

  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;

  @ApiProperty({ enum: UserLevelEnum, })
  levelTitle: string;

  @ApiProperty()
  salesToNextLevel: number;
}
