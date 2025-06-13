import { GroupUsers } from '../group-users.entity';

export type UsersByUserId = {
  groupMember: GroupUsers | null;
  adminGroup: GroupUsers | null;
};
