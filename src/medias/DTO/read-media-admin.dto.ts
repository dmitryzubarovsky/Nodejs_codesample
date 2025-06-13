import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class ReadMediaAdminDTO extends BaseResponseDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  videoId: number;

  @ApiProperty({ nullable: true, })
  previewImageId: number;
}
