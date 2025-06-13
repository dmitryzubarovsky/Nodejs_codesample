import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class AllTrainingsUserResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true, })
  previewImageId: number;
}
