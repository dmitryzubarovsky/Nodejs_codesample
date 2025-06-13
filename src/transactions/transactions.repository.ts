import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import {
  TransactionsHistoryForUserResponseDTO,
  TransactionsHistoryResponseDTO
} from './DTO';
import { Transactions } from './transactions.entity';
import { Amount, PendingPayoutAmount } from './common/types';
import { PayoutPendingUsersDTO, OptionalTimeRangeQueryDTO } from '../common/DTO';
import { TransactionsStatusEnum, TransactionsTypeEnum } from '../common/enums';

@EntityRepository(Transactions)
export class TransactionsRepository extends BaseRepository<Transactions> {

  async getBalance(userId: number): Promise<Amount> {
    const query = `WITH f AS (
                    SELECT COALESCE(SUM(CASE WHEN type = '${TransactionsTypeEnum.REFILL}'  AND status = '${TransactionsStatusEnum.SUCCESSES}' THEN amount ELSE 0 END), 0)::float AS refill,
                           COALESCE(SUM(CASE WHEN type != '${TransactionsTypeEnum.REFILL}'  AND status = '${TransactionsStatusEnum.SUCCESSES}' THEN amount ELSE 0 END), 0)::float  AS payOut
       FROM transactions
                    WHERE deleted_at IS NULL  AND user_id = $1)
                    SELECT to_char((refill  - payOut) / 100, 'FM999900000000.00')::float AS amount from f`;
    const data = await this.query(query, [ userId, ]);
    return data.pop();
  }

  getTransactionsHistory(timeRange: OptionalTimeRangeQueryDTO, userId?: number): Promise<Array<TransactionsHistoryResponseDTO>> {
    const params = [];
    let count = 0;
    let query = `SELECT id, 
                          created_at AS "createdAt", 
                          updated_at AS "updatedAt", 
                          deleted_at AS "deletedAt", 
                          type,
                          to_char(amount / 100, 'FM99990.00')  AS amount,
                          currency,
                          status
             FROM transactions
             WHERE deleted_at IS NULL `;

    if (userId) {
      count++;
      query += ` AND user_id = $${count}`;
      params.push(userId);
    }
    if (timeRange.startDate) {
      count++;
      query += ` AND created_at BETWEEN $${count} AND $${++count}`;
      params.push(timeRange.startDate, timeRange.endDate);
    }
    return this.query(query, params);
  }

  getTransactionsHistoryForAdmin(timeRange: OptionalTimeRangeQueryDTO): Promise<Array<TransactionsHistoryForUserResponseDTO>> {
    const params = [];
    let query = `SELECT transactions.id,
                         transactions.created_at             AS "createdAt",
                         transactions.updated_at             AS "updatedAt",
                         transactions.deleted_at             AS "deletedAt",
                         u.id                                AS "userId",
                         u.full_name                         AS "fullName",
                         u.nickname,
                         u.email,
                         u.phone_number                      AS "phoneNumber",
                         type,
                         to_char(amount / 100, 'FM99990.00') AS amount,
                         currency,
                         status
                  FROM transactions
                           LEFT JOIN users u on u.id = transactions.user_id AND u.deleted_at IS NULL
                  WHERE transactions.deleted_at IS NULL `;

    if (timeRange.startDate) {
      query += ' AND transactions.created_at BETWEEN $1 AND $2';
      params.push(timeRange.startDate, timeRange.endDate);
    }
    return this.query(query, params);
  }

  getCommissionForToday(): Promise<Array<Amount>> {
    const query = `SELECT
           COALESCE(SUM(amount), 0)::int AS amount
         FROM transactions
         WHERE deleted_at IS NULL AND type = '${TransactionsTypeEnum.PAY_OUT}' 
         AND date_trunc('day',created_at) = date_trunc('day',now()) AND status = '${TransactionsStatusEnum.PENDING}'`;

    return this.query(query);
  }

  getPayoutAmount(stripePaymentId: number, status: TransactionsStatusEnum): Promise<Array<PendingPayoutAmount>> {
    const query = `SELECT COALESCE(SUM(amount), 0)::int AS amount,
         currency,
         COALESCE(COUNT(DISTINCT user_id), 0)::int      AS "usersAmount",
         payment_id                                     AS "paymentIdHash"
         FROM transactions
         LEFT JOIN stripe_payments sp on sp.id = $1
         WHERE transactions.deleted_at IS NULL AND type = '${TransactionsTypeEnum.PAY_OUT}' AND transactions.status = $2 AND stripe_payment_id = $1
         GROUP BY currency, payment_id`;

    return this.query(query, [ stripePaymentId, status, ]);
  }

  getTotalPayoutAmount(): Promise<[{ amount: number }]> {
    const query = `SELECT COALESCE(SUM(t.amount), 0)::int AS "amount"
                    FROM transactions t
                    WHERE t.status = '${TransactionsStatusEnum.PENDING}' AND t.type = '${TransactionsTypeEnum.PAY_OUT}'`;
    return this.query(query);
  }

  getPayoutPendingUsers(): Promise<Array<PayoutPendingUsersDTO>> {
    const query = `SELECT transactions.created_at AS "createdAt",
       u.id                                       AS "userId",
       u.full_name                                AS "fullName",
       nickname,
       email,
       phone_number,
       to_char(sum(amount) / 100, 'FM99990.00')   AS amount,
       currency,
       status
FROM transactions
LEFT JOIN users u on u.id = transactions.user_id
WHERE transactions.deleted_at IS NULL AND type = '${TransactionsTypeEnum.PAY_OUT}' AND status = '${TransactionsStatusEnum.PENDING}'
group by u.full_name, currency, status, nickname, email, phone_number, transactions.created_at, u.id`;

    return this.query(query);
  }
}
