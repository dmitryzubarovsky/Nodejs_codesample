import { ApiProperty } from '@nestjs/swagger';

import { VimeoFileDTO } from '../../common/DTO';
import { BaseResponseDTO } from '../../common/base';

export class ReadTrainingUserDTO extends BaseResponseDTO {
  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true, })
  description: string;

  @ApiProperty()
  link: string;

  @ApiProperty({ nullable: true, })
  previewImageId: number;

  @ApiProperty()
  categoryId: number;

  @ApiProperty()
  categoryTitle: string;

  @ApiProperty({ isArray: true, type: VimeoFileDTO, })
  files: Array<VimeoFileDTO>;
}
