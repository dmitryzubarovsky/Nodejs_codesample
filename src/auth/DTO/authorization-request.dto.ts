import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { toLowerCase } from '../../common/utilities/string.helper';

export class AuthorizationRequestDTO {
  @IsString()
  @IsNotEmpty()
  @Transform(status => toLowerCase(status), { toClassOnly: true, })
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Transform(status => toLowerCase(status), { toClassOnly: true, })
  @ApiProperty()
  password: string;
}
