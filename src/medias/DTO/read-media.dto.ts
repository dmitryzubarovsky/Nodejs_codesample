import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { VimeoFileDTO } from '../../common/DTO';

export class ReadMediaDTO extends BaseResponseDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  link: string;

  @ApiProperty({ nullable: true, })
  previewImageId: number;

  @ApiProperty({ isArray: true, type: VimeoFileDTO, })
  files: Array<VimeoFileDTO>;
}
