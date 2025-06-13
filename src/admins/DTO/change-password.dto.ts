import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { TokenDTO } from '../../common/DTO';

export class ChangePasswordForRootDTO extends TokenDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
