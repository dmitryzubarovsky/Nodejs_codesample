import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { commonTableMigrationsColumns } from '../src/common/constants';

export class createComplaintsTable1645520187975 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'complaints',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'is_indecent',
          type: 'boolean',
        },
        {
          name: 'is_sensitive',
          type: 'boolean',
        },
        {
          name: 'is_rude',
          type: 'boolean',
        },
        {
          name: 'description',
          type: 'varchar',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('complaints');
  }
}
