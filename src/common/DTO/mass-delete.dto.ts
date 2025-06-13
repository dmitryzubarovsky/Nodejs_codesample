import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsSafeInt } from '../validators';

export class MassDeleteDTO {
    @IsNotEmpty()
    @IsInt({ each: true, })
    @IsSafeInt({ each: true, })
    @IsArray()
    @ArrayNotEmpty()
    @ApiProperty({ type: 'number', isArray: true, })
    ids: Array<number>;
}
