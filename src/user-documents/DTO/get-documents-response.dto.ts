import { ApiProperty } from '@nestjs/swagger';

import { UsersDocumentsStatus } from '../../common/enums';

export class GetDocumentsResponseDTO {
  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  documentId: number;

  @ApiProperty({ enum: UsersDocumentsStatus, })
  status: UsersDocumentsStatus;
}
