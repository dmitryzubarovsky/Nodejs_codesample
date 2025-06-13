import { EntityRepository } from 'typeorm';

import { ReadAllUserDTO, ReadUserResponseDTO } from './DTO';
import { BaseRepository } from '../common/base';
import { User } from './user.entity';
import { IDateRange } from '../common/utilities/interface';
import {
  DateUnitEnum,
  GroupsUsersEnum,
  SalesStatusEnum,
  TransactionsStatusEnum,
  TransactionsTypeEnum, UsersDocumentsStatus
} from '../common/enums';
import { RatingQueryDTO } from '../common/DTO';
import { UserRating } from '../common/types/user-rating.type';

@EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
  private static readonly subQueryKey = 'subQueryKey';
  private static readonly baseRatingQuery = `
  SELECT *
      FROM (
               SELECT u.id                                                                  AS "id",
                      u.created_at                                                          AS "createdAt",
                      u.updated_at                                                          AS "updatedAt",
                      u.deleted_at                                                          AS "deletedAt",
                      u.nickname                                                            AS "nickname",
                      u.avatar_image_id                                                     AS "avatarImageId",
                      g.id                                                                  AS "groupId",
                      g.avatar_image_id                                                     AS "groupAvatarImageId",
                      u.country_id                                                          AS "countryId",
                      u.state_id                                                            AS "stateId",
                      u.city                                                                AS "city",
                      COUNT(s.user_id)::int                                                 AS "salesAmount",
                      ROW_NUMBER() OVER (ORDER BY COUNT(s.user_id) DESC, u.created_at)::int AS "ratingNumber"
               FROM users u
                        LEFT JOIN sales s ON s.user_id = u.id AND s.status != '${SalesStatusEnum.REFUNDED}'
                        ${UserRepository.subQueryKey}
                        LEFT JOIN group_users gu
                                  ON u.id = gu.user_id AND gu.deleted_at IS NULL AND gu.status = 'Accepted'
                        LEFT JOIN groups g ON gu.group_id = g.id AND g.deleted_at IS NULL
               WHERE u.deleted_at IS NULL AND u.confirmed_at IS NOT NULL
               GROUP BY u.id, g.id, u.nickname
           ) r`;

  getUserSalesRatingTop(date: IDateRange, limit: number, userId: number): Promise<Array<UserRating>> {
    const subQuery = 'AND s.created_at BETWEEN $1 AND $2';
    let query = UserRepository.baseRatingQuery.replace(UserRepository.subQueryKey, subQuery);
    query += ' WHERE "ratingNumber" BETWEEN 1 AND $3 OR id=$4';
    return this.query(query, [ date.startDate, date.endDate, limit, userId, ]);
  }

  getUsersSalesRating(params?: RatingQueryDTO): Promise<Array<UserRating>> {
    const minSales = 0;
    const sqlParams: [ string, number, number?, ] = [ `%${params?.search ?? ''}%`, params?.salesFrom ?? minSales, ];
    let query = UserRepository.baseRatingQuery.replace(UserRepository.subQueryKey, '');
    query += ' WHERE "nickname" ILIKE $1 AND "salesAmount" >= $2';
    if (params.salesTo !== undefined) {
      query += ' AND "salesAmount" <= $3';
      sqlParams.push(params.salesTo);
    }
    return this.query(query, sqlParams);
  }

  getUsersWithoutGroup(groupId: number, search?: string): Promise<Array<UserRating>> {
    const params = [];
    params.push(groupId);
    let query = `SELECT   u.id                  AS "id",
                          u.nickname            AS "nickname",
                          u.avatar_image_id     AS "avatarImageId",
                          u.country_id          AS "countryId",
                          u.state_id            AS "stateId",
                          u.city                AS "city",
                          COUNT(s.user_id)::int AS "salesAmount"
                     FROM users u
                               LEFT JOIN group_users gu
                               ON u.id = gu.user_id AND gu.deleted_at IS NULL AND (gu.status = '${GroupsUsersEnum.ACCEPTED}' OR gu.group_id = $1)
                            LEFT JOIN sales s ON u.id = s.user_id AND s.status != '${SalesStatusEnum.REFUNDED}'
                     WHERE u.deleted_at IS NULL
                        AND u.confirmed_at IS NOT NULL
                        AND gu.id IS NULL`;
    if (search) {
      query += ' AND u.nickname ILIKE $2';
      params.push(`%${search}%`);
    }
    query += ' GROUP BY u.id';
    return this.query(query, params);
  }

  getUsersWithoutGroupByAdmin(search?: string): Promise<Array<UserRating>> {
    const params = [];
    let query = `SELECT   u.id                  AS "id",
                          u.nickname            AS "nickname",
                          u.avatar_image_id     AS "avatarImageId",
                          u.country_id          AS "countryId",
                          u.state_id            AS "stateId",
                          u.city                AS "city",
                          COUNT(s.user_id)::int AS "salesAmount"
                     FROM users u
                               LEFT JOIN group_users gu
                               ON u.id = gu.user_id AND gu.deleted_at IS NULL AND (gu.status = '${GroupsUsersEnum.ACCEPTED}')
                            LEFT JOIN sales s ON u.id = s.user_id AND s.status != '${SalesStatusEnum.REFUNDED}'
                     WHERE u.deleted_at IS NULL
                        AND u.confirmed_at IS NOT NULL
                        AND gu.id IS NULL`;
    if (search) {
      query += ' AND u.nickname ILIKE $1';
      params.push(`%${search}%`);
    }
    query += ' GROUP BY u.id';
    return this.query(query, params);
  }

  getAllUsers(options: ReadAllUserDTO): Promise<Array<ReadUserResponseDTO>> {
    let query = `SELECT DISTINCT users.id,
                users.created_at                                      AS "createdAt",
                users.updated_at                                      AS "updatedAt",
                users.deleted_at                                      AS "deletedAt",
                full_name                                             AS "fullName",
                nickname,
                users.email,
                phone_number                                          AS "phoneNumber",
                users.cpf,
                profession,
                birth_date                                            AS "birthDate",
                about,
                zip,
                users.country_id                                      AS "countryId",
                users.state_id                                        AS "stateId",
                users.city,
                district,
                street,
                house,
                apartment,
                avatar_image_id                                       AS "avatarImageId",
                CASE WHEN locked_at IS NULL THEN false ELSE true END  AS "isLocked",
                CASE WHEN ud.id IS NOT NULL THEN true ELSE false END  AS "invoicingPermissions",
                p.id                                                  AS "pixId",
                ba.id                                                 AS "bankAccountId",
                COALESCE(balance.amount, 0)                         AS "balance"
         FROM users
         LEFT JOIN users_documents ud ON ud.user_id = users.id AND ud.status = '${UsersDocumentsStatus.VERIFIED}'
         LEFT JOIN pix p on users.id = p.user_id AND p.deleted_at IS NULL
         LEFT JOIN bank_accounts ba ON users.id = ba.user_id AND ba.deleted_at IS NULL
              LEFT JOIN (
            WITH f AS (
                SELECT 
                COALESCE(SUM(CASE WHEN type = '${TransactionsTypeEnum.REFILL}' AND status = '${TransactionsStatusEnum.SUCCESSES}' THEN amount ELSE 0 END), 0)::float AS refill,
                COALESCE(SUM(CASE WHEN type = '${TransactionsTypeEnum.PAY_OUT}'  AND status != '${TransactionsStatusEnum.SUCCESSES}' THEN amount ELSE 0 END), 0)::float AS payOut,
                user_id            AS "userId"
            FROM transactions
            WHERE deleted_at IS NULL
            GROUP BY user_id)

            SELECT to_char((refill - payOut) / 100, 'FM999900000000.00')::float AS amount,
                "userId"
            FROM f) balance ON balance."userId" = users.id
         WHERE users.deleted_at IS NULL AND confirmed_at IS NOT NULL AND full_name ILIKE $1`;
    if (options.isReferral) {
      query += ' AND refer_id IS NOT NULL';
    }
    if (options.invoicingPermissions) {
      query += ` AND CASE WHEN ud.status = '${UsersDocumentsStatus.VERIFIED}' THEN true ELSE false END = ${options.invoicingPermissions}`;
    }

    return this.query(query, [ `%${options.search ?? ''}%`, ]);
  }

  getNumberOfNewUsers(date: IDateRange, stepUnit: DateUnitEnum, dataFormat: string): Promise<Array<{ numberOfNewUsers: number }>> {
    const query = `SELECT COALESCE(count(id), 0)::int AS "numberOfNewUsers"
                     FROM generate_series($1 ::timestamp , $2 ::timestamp , '1 ${stepUnit}'::interval) "days"
             LEFT JOIN users ON to_char(confirmed_at, $3) = to_char("days", $3)
             GROUP BY "days" ORDER BY "days"`;
    return this.query(query, [ date.startDate, date.endDate, dataFormat, ]);
  }

  getNumberOfRegistrationRequest(date: IDateRange, stepUnit: DateUnitEnum, dataFormat: string): Promise<Array<{ numberOfRegistrationRequest: number }>> {
    const query = `SELECT COALESCE(count(id), 0)::int AS "numberOfRegistrationRequest"
                     FROM generate_series($1 ::timestamp , $2 ::timestamp , '1 ${stepUnit}'::interval) "days"
             LEFT JOIN users ON to_char(created_at, $3) = to_char("days", $3)
             GROUP BY "days" ORDER BY "days"`;
    return this.query(query, [ date.startDate, date.endDate, dataFormat, ]);
  }

  confirmUser(userId: number): Promise<Array<ReadUserResponseDTO>> {
    const query = `
                UPDATE users 
                  SET
                    updated_at = CURRENT_TIMESTAMP,
                    confirmed_at = CURRENT_TIMESTAMP
                WHERE id = $1;`;

    return this.query(query, [ userId, ]);
  }
}
