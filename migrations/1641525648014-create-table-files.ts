import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableFiles1641525648014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'files',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'container_name',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'file_name',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'file_size',
          type: 'integer',
          isNullable: true,
        },
        {
          name: 'content_type',
          type: 'varchar',
          isNullable: true,
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('files', true);
  }
}
