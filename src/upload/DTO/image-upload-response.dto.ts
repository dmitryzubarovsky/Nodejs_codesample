import { ApiProperty } from '@nestjs/swagger';

export class ImageUploadResponseDTO {
  @ApiProperty()
  fileId: number;

  @ApiProperty()
  imageId: number;
}
