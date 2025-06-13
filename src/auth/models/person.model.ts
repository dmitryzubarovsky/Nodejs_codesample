import { AdminRoleEnum, UserLevelEnum } from '../../common/enums';

export class Person {
  userId?: number;
  groupId?: number;
  adminGroupId?: number;
  level?: Promise<UserLevelEnum>;
  isAdmin: boolean;
  adminId?: number;
  adminRole?: AdminRoleEnum;
}
