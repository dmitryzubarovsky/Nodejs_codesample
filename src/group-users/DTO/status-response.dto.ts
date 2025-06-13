import { ApiProperty } from '@nestjs/swagger';

export class StatusResponseDTO {
  @ApiProperty()
  status: boolean;
}
