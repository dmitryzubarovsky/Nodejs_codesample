import { BaseResponseDTO } from '../../common/base';
import { ApiProperty } from '@nestjs/swagger';
import { UsersDocumentsStatus } from '../../common/enums';

export class UpdateDocumentsResponseDTO extends BaseResponseDTO {
  @ApiProperty({ enum: UsersDocumentsStatus, })
  status: UsersDocumentsStatus;

  @ApiProperty()
  comment: string;
}
