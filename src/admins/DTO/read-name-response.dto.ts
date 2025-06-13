import { ApiProperty } from '@nestjs/swagger';

export class ReadNameResponseDTO {
  @ApiProperty()
  name: string;
}
