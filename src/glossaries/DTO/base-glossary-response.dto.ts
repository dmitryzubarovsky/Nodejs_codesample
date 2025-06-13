import { ApiProperty } from '@nestjs/swagger';

export class BaseGlossaryResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;
}
