import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class ReadAllMediasResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true, })
  previewImageId: number;
}
