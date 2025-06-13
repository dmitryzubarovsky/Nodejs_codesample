import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class UserImageResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  imageId: number;

  @ApiProperty()
  isHidden: boolean;
}
