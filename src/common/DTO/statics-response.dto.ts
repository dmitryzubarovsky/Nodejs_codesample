import { ApiProperty } from '@nestjs/swagger';

export class StaticsResponseDTO {
  @ApiProperty({ type: [ Number, ], })
  week: Array<number>;

  @ApiProperty({ type: [ Number, ], })
  month: Array<number>;

  @ApiProperty({ type: [ Number, ], })
  year: Array<number>;
}
