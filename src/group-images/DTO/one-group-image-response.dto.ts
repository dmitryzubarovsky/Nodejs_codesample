import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class OneGroupImageResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  imageId: number;

  @ApiProperty()
  groupId: number;
}
