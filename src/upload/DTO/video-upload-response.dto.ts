import { ApiProperty } from '@nestjs/swagger';

export class VideoUploadResponseDTO {
  @ApiProperty()
  videoId: number;
}
