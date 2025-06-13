import { ApiProperty } from '@nestjs/swagger';

import { UsersDocumentsStatus } from '../../common/enums';

export class DocumentsStatusResponseDTO {
  @ApiProperty({ enum: UsersDocumentsStatus, })
  status: UsersDocumentsStatus;

  @ApiProperty()
  comment: string;
}
