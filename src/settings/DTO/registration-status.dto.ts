import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class RegistrationStatusDTO {
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  registrationStatus: boolean;
}
