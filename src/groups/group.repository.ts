import { EntityRepository } from 'typeorm';

import type { AllGroupsAdminResponseDTO, GroupResponseDTO } from './DTO';
import { BaseRepository } from '../common/base';
import { Group } from './group.entity';
import type { IDateRange } from '../common/utilities/interface';
import type { GroupRating } from './common/types';
import type { RatingQueryDTO } from '../common/DTO';
import { GroupsUsersEnum, GroupsUsersRoleEnum } from '../common/enums';

@EntityRepository(Group)
export class GroupRepository extends BaseRepository<Group> {
  private static readonly subQueryKey = 'subQueryKey';
  private static readonly baseRatingQuery = `
  SELECT * FROM
  (
  SELECT g.id                  AS "id",
         g.name                AS "groupName",
         g.avatar_image_id     AS "groupAvatarImageId",
         ad.id                 AS "creatorId",
         ad.full_name          AS "creatorName",
         ad.nickname           AS "creatorNickname",
         COUNT(s.user_id)::int AS "salesAmount",
         ROW_NUMBER() OVER (ORDER BY COUNT(s.user_id) ASC, g.name DESC):: int AS "ratingNumber"
  FROM groups g
           LEFT JOIN group_users ad_gu ON g.id = ad_gu.group_id
      AND ad_gu.role = '${GroupsUsersRoleEnum.ADMIN}'
      AND ad_gu.deleted_at IS NULL
           LEFT JOIN users ad ON ad.id = ad_gu.user_id
      AND ad.deleted_at IS NULL
      AND ad.confirmed_at IS NOT NULL
           LEFT JOIN group_users gu ON gu.group_id = g.id
      AND gu.deleted_at IS NULL
      AND gu.status = '${GroupsUsersEnum.ACCEPTED}'
           LEFT JOIN users u ON u.id = gu.user_id
      AND u.deleted_at IS NULL
      AND u.confirmed_at IS NOT NULL
           LEFT JOIN sales s ON u.id = s.user_id
      AND s.deleted_at IS NULL
      AND s.status = 'approved'
      ${GroupRepository.subQueryKey}
  WHERE g.deleted_at IS NULL
  GROUP BY g.id, ad.id, "creatorNickname"
  ORDER BY "salesAmount" DESC, "creatorNickname" ASC
  ) r`;

  readRatingTop(date: IDateRange, limit: number, groupId: number): Promise<Array<GroupRating>> {
    const subQuery = 'AND s.created_at BETWEEN $1 AND $2';
    let query = GroupRepository.baseRatingQuery.replace(GroupRepository.subQueryKey, subQuery);
    query += ' WHERE "ratingNumber" BETWEEN 1 AND $3 OR id=$4';
    return this.query(query, [ date.startDate, date.endDate, limit, groupId, ]);
  }

  readRatingAll(params?: RatingQueryDTO): Promise<Array<GroupRating>> {
    const minSales = 0;
    const sqlParams: [ string, number, number?, ] = [ `%${params?.search ?? ''}%`, params?.salesFrom ?? minSales, ];
    let query = GroupRepository.baseRatingQuery.replace(GroupRepository.subQueryKey, '');
    query += ' WHERE "groupName" ILIKE $1 AND "salesAmount" >= $2';
    if (params.salesTo !== undefined) {
      query += ' AND "salesAmount" <= $3';
      sqlParams.push(params.salesTo);
    }
    return this.query(query, sqlParams);
  }

  async read(id: number): Promise<GroupResponseDTO> {
    const query = `SELECT
                    g.id                AS "id",
                    g.created_at        AS "createdAt",
                    g.updated_at        AS "updatedAt",
                    g.deleted_at        AS "deletedAt",
                    g.name,
                    g.avatar_image_id   AS "avatarImageId",
                    count(gu.id)::int   AS "memberAmount"
                FROM groups g
                LEFT JOIN group_users gu 
                    ON g.id = gu.group_id AND gu.deleted_at IS NULL AND gu.status = '${GroupsUsersEnum.ACCEPTED}'
                WHERE g.id = $1 AND g.deleted_at IS NULL
                GROUP BY g.id`;
    const [ group, ] = await this.query(query, [ id, ]);
    return group;
  }

  readAllGroupsForAdmin(): Promise<Array<AllGroupsAdminResponseDTO>> {
    const query = `SELECT DISTINCT groups.id,
                        groups.created_at       AS "createdAt",
                        groups.updated_at       AS "updatedAt",
                        groups.deleted_at       AS "deletedAt",
                        groups.blocked_at       AS "blockedAt",
                        groups.name             AS "name",
                        groups.avatar_image_id  AS "avatarImageId",
                        u.id                    AS "creatorId",
                        u.full_name             AS "creatorName",
                        u.nickname              AS "creatorNickname",
                        COUNT(gu.group_id) ::int AS "memberAmount"
                  FROM groups
                  LEFT JOIN group_users gu on groups.id = gu.group_id AND gu.deleted_at IS NULL AND gu.status = '${GroupsUsersEnum.ACCEPTED}'
                  LEFT JOIN group_users gua on groups.id = gua.group_id AND gua.role = '${GroupsUsersRoleEnum.ADMIN}' AND gua.deleted_at IS NULL
                  LEFT JOIN users u on gua.user_id = u.id
                  GROUP BY groups.id, u.id`;

    return this.query(query);
  }
}
