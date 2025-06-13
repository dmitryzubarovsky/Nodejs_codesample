import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { GroupCreatorResponseDTO } from '../../group-users/DTO';

export class GroupResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true, })
  avatarImageId: number;

  @ApiProperty()
  memberAmount: number;

  @ApiProperty()
  ratingNumber: number;

  @ApiProperty({ type: GroupCreatorResponseDTO, })
  creator: GroupCreatorResponseDTO;
}
