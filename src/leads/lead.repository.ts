import { EntityRepository } from 'typeorm';

import { Lead } from './lead.entity';
import { BaseRepository } from '../common/base';
import type { LeadAllResponseDTO } from './DTO';
import { LeadFilter } from './common/types';
import { OrderByEnum } from '../common/enums';

@EntityRepository(Lead)
export class LeadRepository extends BaseRepository<Lead> {
  readAll(options: LeadFilter, userId?: number): Promise<Array<LeadAllResponseDTO>> {
    const params = [];
    let count = 0;
    let query = `SELECT leads.id,
                    leads.created_at AS "createdAt",
                    leads.updated_at AS "updatedAt",
                    leads.deleted_at AS "deletedAt",
                    leads.name,
                    leads.email,
                    leads.phone_number AS "phoneNumber",
                    leads.comment,
                    status,
                    u.id      AS "userId",
                    u.full_name AS "userName"

            FROM leads
            INNER JOIN users u on u.id = leads.user_id
            WHERE leads.deleted_at IS NULL`;
    if (userId) {
      count ++;
      query += ` AND u.id = $${count}`;
      params.push(userId);
    }

    if (options.statuses) {
      count ++;
      query += ` AND status = ANY($${count})`;
      params.push(options.statuses);
    }
    if (options.search) {
      count ++;
      query += ` AND leads.name ILIKE $${count}`;
      params.push(`%${options.search}%`);
    }

    if (options.sorting) {
      const firstPart = 'SELECT * FROM (';
      const lastPart = `) AS t ORDER BY ${this.getOrderBy(options.orderBy)} ${options.sorting}`;
      query = firstPart + query + lastPart;
    }

    return this.query(query, params);
  }

  private getOrderBy(orderBy: OrderByEnum): string {
    const orderByVariants = {
      [OrderByEnum.CREATED]: 't."createdAt"',
      [OrderByEnum.ALPHABET]: 't."name"',
    };
    return orderByVariants[orderBy];
  }
}
