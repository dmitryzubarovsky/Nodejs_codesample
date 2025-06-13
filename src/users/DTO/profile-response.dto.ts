import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { UserLevelEnum, UsersDocumentsStatus } from '../../common/enums';
import { levelExamples } from '../../common/constants';

export class UserProfileResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  nickname: string;

  @ApiProperty({ nullable: true, })
  avatarImageId: number;

  @ApiProperty({ nullable: true, })
  groupId: number;

  @ApiProperty({ nullable: true, })
  groupAvatarImageId: number;

  @ApiProperty()
  countryId: number;

  @ApiProperty()
  stateId: number;

  @ApiProperty()
  city: string;

  @ApiProperty({ nullable: true, })
  about: string;

  @ApiProperty({ enum: levelExamples, })
  level: UserLevelEnum;

  @ApiProperty({ enum: UserLevelEnum, })
  levelTitle: string;

  @ApiProperty()
  stars: number;

  @ApiProperty()
  invoicingPermissions: boolean;

  @ApiProperty()
  documentId: number;

  @ApiProperty({ enum: UsersDocumentsStatus, })
  documentStatus: UsersDocumentsStatus;
}
