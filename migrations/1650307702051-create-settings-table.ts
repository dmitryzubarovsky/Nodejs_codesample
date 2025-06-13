import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createSettingsTable1650307702051 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'settings',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'name',
          type: 'varchar',
        },
        {
          name: 'value',
          type: 'varchar',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('settings');
  }
}
