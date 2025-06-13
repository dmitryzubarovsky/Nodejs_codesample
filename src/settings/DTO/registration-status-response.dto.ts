import { ApiProperty } from '@nestjs/swagger';

export class RegistrationStatusResponseDTO {
  @ApiProperty()
  registrationStatus: boolean;
}
