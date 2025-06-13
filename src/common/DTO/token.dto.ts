import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { uuid } from 'aws-sdk/clients/customerprofiles';

export class TokenDTO {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  token: uuid;
}
