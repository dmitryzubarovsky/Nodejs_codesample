import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IsNullable } from '../../common/validators';

export class CreateComplaintDTO {
  @IsNullable()
  @IsNumber()
  @ApiProperty({ nullable: true, })
  userId: number;

  @IsNullable()
  @IsNumber()
  @ApiProperty({ nullable: true, })
  groupId: number;

  @IsNullable()
  @IsArray()
  @ApiProperty({ isArray: true, type: 'number', nullable: true, })
  userImageIds: Array<number>;

  @IsNullable()
  @IsArray()
  @ApiProperty({ isArray: true, type: 'number', nullable: true, })
  groupImageIds: Array<number>;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isIndecent: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isRude: boolean;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isSensitive: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
