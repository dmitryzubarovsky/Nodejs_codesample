import { EntityRepository } from 'typeorm';

import { BaseRepository } from '../common/base';
import { UsersDocuments } from './user-document.entity';
import { OrderByEnum, UsersDocumentsStatus } from '../common/enums';
import type { DocumentsFilter } from './common/types';
import type { GetDocumentResponseDTO, GetDocumentsResponseDTO } from './DTO';

@EntityRepository(UsersDocuments)
export class UserDocumentRepository extends BaseRepository<UsersDocuments> {

  readAllByAdmin(options: DocumentsFilter): Promise<Array<GetDocumentsResponseDTO>> {
    const params = [];
    let count = 0;
    let query = `SELECT DISTINCT
                    users.id                AS "userId",
                    users.full_name         AS "name",
                    users.email,
                    users.phone_number      AS "phone",
                    ud.updated_at           AS "updatedAt",
                    ud.id                   AS "documentId",
                    ud.status                AS "status"

            FROM users
            INNER JOIN users_documents ud on ud.user_id = users.id AND ud.deleted_at IS NULL
            WHERE users.deleted_at IS NULL AND ud.status != '${UsersDocumentsStatus.NOT_LOAD}'`;

    if (options.statuses) {
      count ++;
      query += ` AND ud.status = ANY($${count})`;
      params.push(options?.statuses);
    }
    if (options.search) {
      count ++;
      query += ` AND users.full_name ILIKE $${count}`;
      params.push(`%${options.search}%`);
    }
    if (options.sorting) {
      const firstPart = 'SELECT * FROM (';
      const lastPart = `) AS t ORDER BY ${UserDocumentRepository.getOrderBy(options.orderBy)} ${options.sorting}`;
      query = firstPart + query + lastPart;
    }

    return this.query(query, params);
  }

  read(id: number): Promise<Array<GetDocumentResponseDTO>> {
    const query = `SELECT id,
                    created_at AS "createdAt",
                    updated_at AS "updatedAt",
                    deleted_at AS "deletedAt",
                    status,
                    comment
            FROM users_documents
 WHERE deleted_at IS NULL AND id = $1`;
    return this.query(query, [ id, ]);
  }

  private static getOrderBy(orderBy: OrderByEnum): string {
    const orderByVariants = {
      [OrderByEnum.CREATED]: 't."updatedAt"',
      [OrderByEnum.ALPHABET]: 't."name"',
    };
    return orderByVariants[orderBy];
  }
}
