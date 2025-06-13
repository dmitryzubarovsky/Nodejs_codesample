import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

import { commonTableMigrationsColumns } from '../src/common/constants';

export class createLeadBasesTable1643797641019 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE lead_status AS enum (\'Contacted\', \'In negotiations\', \'Postponed\', \'Link sent\', \'Sold\', \'Lost\')');

    await queryRunner.createTable(new Table({
      name: 'leads',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'name',
          type: 'varchar',
        },
        {
          name: 'email',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'birth_date',
          type: 'date',
          isNullable: true,
        },
        {
          name: 'phone_number',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'status',
          type: 'lead_status',
        },
        {
          name: 'comment',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'user_id',
          type: 'int',
        },
      ],
    }));

    await queryRunner.createForeignKey('leads', new TableForeignKey({
      columnNames: [ 'user_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('leads');
    await queryRunner.query('DROP TYPE lead_status');
  }
}
