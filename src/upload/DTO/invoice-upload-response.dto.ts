import { ApiProperty } from '@nestjs/swagger';

export class InvoiceUploadResponseDTO {
  @ApiProperty()
  fileId: number;

  @ApiProperty()
  invoiceId: number;
}
