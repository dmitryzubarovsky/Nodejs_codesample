import { ApiProperty } from '@nestjs/swagger';

export class AccountLinkResponseDTO {
  @ApiProperty()
  accountLink: string;
}
