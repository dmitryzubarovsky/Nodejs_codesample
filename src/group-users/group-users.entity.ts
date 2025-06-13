import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '../common/base';
import { User } from '../users/user.entity';
import { GroupsUsersEnum, GroupsUsersRoleEnum } from '../common/enums';
import { Group } from '../groups/group.entity';

@Entity('group_users')
export class GroupUsers extends BaseEntity {
  @Column()
  status: GroupsUsersEnum;

  @Column()
  role: GroupsUsersRoleEnum;

  @ManyToOne(() => User, user => user.groupUsers)
  @JoinColumn({ name: 'user_id', })
  user: User;

  @ManyToOne(() => Group, group => group.groupUsers)
  @JoinColumn({ name: 'group_id', })
  group: Group;
}
