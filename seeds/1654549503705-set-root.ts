import { getConnection, MigrationInterface, QueryRunner } from 'typeorm';
import { hashSync } from 'bcrypt';

import { defaultEmail, PASSWORD_HASH_SALT } from '../src/common/constants';
import { AdminRoleEnum } from '../src/common/enums';

export class setRoot1654549503705 implements MigrationInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async up(queryRunner: QueryRunner): Promise<void> {
    const connection = getConnection('seed');

    await connection
      .createQueryBuilder()
      .insert()
      .into('admins')
      .values({
        email: defaultEmail,
        full_name: 'Root',
        password: hashSync('rootadmin', PASSWORD_HASH_SALT),
        role: AdminRoleEnum.ROOT,
      })
      .execute();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    const connection = getConnection('seed');

    await connection
      .createQueryBuilder()
      .delete()
      .from('admins')
      .where('email = :email', { email: defaultEmail, })
      .execute();
  }
}
