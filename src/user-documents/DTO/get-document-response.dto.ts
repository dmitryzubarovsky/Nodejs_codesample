import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { UsersDocumentsStatus } from '../../common/enums';

export class GetDocumentResponseDTO extends BaseResponseDTO {
  @ApiProperty({ enum: UsersDocumentsStatus, })
  status: UsersDocumentsStatus;

  @ApiProperty()
  comment: string;
}
