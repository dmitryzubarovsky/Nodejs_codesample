import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class MediaResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;
}
