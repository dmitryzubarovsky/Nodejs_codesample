import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class GetGroupImageResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  imageId: number;

  @ApiProperty()
  isHidden: boolean;
}
