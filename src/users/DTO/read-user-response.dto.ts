import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { UserLevelEnum } from '../../common/enums';
import { levelExamples } from '../../common/constants';

export class ReadUserResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  confirmedAt: Date;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  cpf: string;

  @ApiProperty({ nullable: true, })
  profession: string;

  @ApiProperty({ nullable: true, })
  birthDate: Date;

  @ApiProperty({ nullable: true, })
  about: string;

  @ApiProperty({ nullable: true, })
  zip: string;

  @ApiProperty()
  countryId: number;

  @ApiProperty()
  stateId: number;

  @ApiProperty()
  city: string;

  @ApiProperty({ nullable: true, })
  district: string;

  @ApiProperty({ nullable: true, })
  street: string;

  @ApiProperty({ nullable: true, })
  house: string;

  @ApiProperty({ nullable: true, })
  apartment: string;

  @ApiProperty({ nullable: true, })
  avatarImageId: number;

  @ApiProperty()
  isLocked: boolean;

  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;

  @ApiProperty({ enum: UserLevelEnum, })
  levelTitle: string;

  @ApiProperty()
  intStars: number;

  @ApiProperty()
  starThirds: number;

  @ApiProperty()
  invoicingPermissions: boolean;

  @ApiProperty()
  pixId: number;

  @ApiProperty()
  bankAccountId: number;

  @ApiProperty()
  balance: number;
}
