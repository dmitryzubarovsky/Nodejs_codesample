import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class AllGroupsAdminResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  blockedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true, })
  avatarImageId: number;

  @ApiProperty()
  creatorId: number;

  @ApiProperty()
  creatorName: string;

  @ApiProperty()
  creatorNickname: string;

  @ApiProperty()
  membersAmount: number;
}
