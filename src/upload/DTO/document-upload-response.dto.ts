import { ApiProperty } from '@nestjs/swagger';

export class DocumentUploadResponseDTO {
  @ApiProperty()
  fileId: number;

  @ApiProperty()
  documentId: number;
}
