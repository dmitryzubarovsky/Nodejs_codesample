import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDTO } from '../../common/base';

export class CreateUserImageResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  imageId: number;
}
