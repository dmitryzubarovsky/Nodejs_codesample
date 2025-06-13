import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

import { convertPhoneNumber } from '../../common/utilities';

export class PhoneNumberDTO {
    @IsPhoneNumber('BR')
    @IsString()
    @IsNotEmpty()
    @Transform(phone => convertPhoneNumber(phone), { toClassOnly: true, })
    @ApiProperty()
    phoneNumber: string;
}
