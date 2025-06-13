import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableCompanies1641525997239 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'companies',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'name',
          type: 'varchar',
        },
        {
          name: 'title',
          type: 'varchar',
        },
        {
          name: 'cnpj',
          type: 'varchar',
        },
        {
          name: 'address',
          type: 'varchar',
        },
        {
          name: 'email',
          type: 'varchar',
        },
        {
          name: 'type',
          type: 'varchar',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('companies');
  }
}
