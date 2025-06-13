import { ApiProperty } from '@nestjs/swagger';

export class GetCommissionForTodayResponseDTO {
  @ApiProperty()
  total: number;
}
