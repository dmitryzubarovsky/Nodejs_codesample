import { ApiProperty } from '@nestjs/swagger';

export class LinkResponseDTO {
  @ApiProperty()
  link: string;
}
