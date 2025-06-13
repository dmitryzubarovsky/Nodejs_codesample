import { ApiProperty } from '@nestjs/swagger';

export class AuthorizationResponseDTO {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  expirationDate: Date;

  @ApiProperty({ nullable: true, })
  userId: number;
}
