import { BaseResponseDTO } from '../../common/base';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupImageResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  imageId: number;
}
