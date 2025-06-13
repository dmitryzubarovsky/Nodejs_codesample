import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';

export class TrainingCategoryResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  title: string;
}
