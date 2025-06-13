import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableAdmins1642704360396 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const query = 'CREATE TYPE admin_role AS enum (\'Root\', \'General\', \'Content\', \'Financial\')';
    await queryRunner.query(query);

    await queryRunner.createTable(new Table({
      name: 'admins',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'full_name',
          type: 'varchar',
        },
        {
          name: 'email',
          type: 'varchar',
        },
        {
          name: 'password',
          type: 'varchar',
        },
        {
          name: 'role',
          type: 'admin_role',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('admins');
    const query = 'DROP TYPE admin_roles';
    await queryRunner.query(query);
  }
}
