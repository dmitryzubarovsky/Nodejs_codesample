import { ApiProperty } from '@nestjs/swagger';

export class TotalResponseDTO {
  @ApiProperty()
  total: number;
}
