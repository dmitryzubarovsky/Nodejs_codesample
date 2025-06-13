import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

import { UpdateGroupDTO } from './update-group.dto';

export class UpdateGroupByAdminDTO extends UpdateGroupDTO {
  @IsInt()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  groupId: number;
}
