import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { GroupUsers } from './group-users.entity';
import { GroupsUsersEnum, OrderByEnum, SalesStatusEnum } from '../common/enums';
import type { GetMemberStatusResponseDTO, ReadGroupMembersForUserDTO } from './DTO';
import type { UserLevel } from '../sales/common/types';
import type { UserRating } from '../common/types/user-rating.type';

@EntityRepository(GroupUsers)
export class GroupUsersRepository extends BaseRepository<GroupUsers> {
  getGroupMembers(groupId: number, options: ReadGroupMembersForUserDTO): Promise<Array<UserRating>> {
    const params = [];
    params.push(groupId);
    const orderBy = this.orderByMap[options.orderBy];
    let query = `SELECT u.id                   AS "id",
                           u.created_at          AS "createdAt",
                           u.updated_at          AS "updatedAt",
                           u.deleted_at          AS "deletedAt",
                           u.nickname            AS "nickname",
                           u.avatar_image_id     AS "avatarImageId",
                           u.country_id          AS "countryId",
                           u.state_id            AS "stateId",
                           u.city                AS "city",
                           count(s.user_id)::int AS "salesAmount"
                    FROM group_users gu
                             LEFT JOIN sales s ON gu.user_id = s.user_id
                        AND s.deleted_at IS NULL
                        AND s.status != '${SalesStatusEnum.REFUNDED}'
                             LEFT JOIN users u ON gu.user_id = u.id
                        AND u.deleted_at IS NULL
                    WHERE gu.group_id = $1
                      AND gu.status = '${GroupsUsersEnum.ACCEPTED}'
                      AND gu.deleted_at IS NULL`;

    if (options.search) {
      query += ' nickname ILIKE $2';
      params.push(`%${options.search}%`);
    }
    query += ` GROUP BY s.user_id, u.id, nickname, "${orderBy}"
               ORDER BY "${orderBy}" ${options.sorting}`;
    return this.query(query, params);
  }

  getMembersRating(groupId: number | string, userId?: number): Promise<Array<UserRating>> {
    const params = [ groupId, ];
    let query = `SELECT *
                    FROM (
                             SELECT *, ROW_NUMBER() OVER ()::int AS "ratingNumber"
                             FROM (
                                      SELECT
                                             u.id                  AS "id",
                                             u.created_at          AS "createdAt",
                                             u.updated_at          AS "updatedAt",
                                             u.deleted_at          AS "deletedAt",
                                             u.nickname            AS "nickname",
                                             u.avatar_image_id     AS "avatarImageId",
                                             u.country_id          AS "countryId",
                                             u.state_id            AS "stateId",
                                             u.city                AS "city",
                                             COUNT(s.user_id)::int AS "salesAmount"
                                      FROM group_users gu
                                               LEFT JOIN sales s ON gu.user_id = s.user_id
                                                    AND s.deleted_at IS NULL
                                                    AND s.status != '${SalesStatusEnum.REFUNDED}'
                                               LEFT JOIN users u ON gu.user_id = u.id
                                      WHERE gu.group_id = $1
                                        AND gu.status = '${GroupsUsersEnum.ACCEPTED}'
                                        AND gu.deleted_at IS NULL
                                        AND u.deleted_at IS NULL
                                      GROUP BY s.user_id, u.id, nickname
                                      ORDER BY "salesAmount" DESC, nickname 
                                  ) w
                         ) z
                    WHERE "ratingNumber" >= 1 AND "ratingNumber" <= 10`;
    if (userId) {
      query += ' OR "id"=$2';
      params.push(userId);
    }
    return this.query(query, params);
  }

  readMembersStatus(groupId: number, search: string, statuses: Array<GroupsUsersEnum>): Promise<Array<Omit<GetMemberStatusResponseDTO, keyof UserLevel>>> {
    const params = [];
    let count = 1;
    let query = `SELECT users.id,
                        users.created_at        AS "createdAt",
                        users.updated_at        AS "updatedAt",
                        users.deleted_at        AS "deletedAt",
                        nickname,
                        users.avatar_image_id   AS "avatarImageId",
                        country_id              AS "countryId",
                        state_id                AS "stateId",
                        city,
                        status
                FROM users
                LEFT JOIN group_users gs ON users.id = gs.user_id AND gs.deleted_at IS NULL
                WHERE users.deleted_at IS NULL AND confirmed_at IS NOT NULL AND gs.group_id = $${count}`;
    params.push(groupId);

    if (search) {
      count ++;
      query += ` AND users.nickname ILIKE $${count}`;
      params.push(`%${search}%`);
    }
    if (statuses) {
      count ++;
      query += ` AND status = ANY($${count})`;
      params.push(statuses);
    }
    query += ` GROUP BY users.id, gs.status
               ORDER BY "createdAt" DESC`;
    return this.query(query, params);
  }

  private readonly orderByMap = {
    [OrderByEnum.CREATED]: 'createdAt',
    [OrderByEnum.ALPHABET]: 'nickname',
  };
}
