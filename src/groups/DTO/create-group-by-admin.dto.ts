import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

import { CreateGroupDTO } from './create-group.dto';

export class CreateGroupByAdminDTO extends CreateGroupDTO {
    @IsInt()
    @IsPositive()
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    userId: number;
}
