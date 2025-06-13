import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class UpdateVideoResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  thirdPartyVideoId: string;
}
