import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class GetGroupResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  blockedAt: Date;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true, })
  avatarImageId: number;
}
