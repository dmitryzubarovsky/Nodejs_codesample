import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDTO } from '../../common/base';
import { GroupsUsersEnum, GroupsUsersRoleEnum } from '../../common/enums';

export class AddGroupMemberResponseDTO extends BaseResponseDTO {
  @ApiProperty()
  status: GroupsUsersEnum;

  @ApiProperty()
  role: GroupsUsersRoleEnum;
}
