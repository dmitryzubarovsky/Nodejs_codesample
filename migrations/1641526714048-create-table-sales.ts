import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableSales1641526714048 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'sales',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'user_id',
          type: 'int',
        },
        {
          name: 'client_name',
          type: 'varchar',
        },
        {
          name: 'product_name',
          type: 'varchar',
        },
        {
          name: 'product_id',
          type: 'varchar',
        },
        {
          name: 'status',
          type: 'varchar',
        },
      ],
    }));

    await queryRunner.createForeignKey('sales', new TableForeignKey({
      columnNames: [ 'user_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createIndex('sales', new TableIndex({
      name: 'sales_user_ids',
      columnNames: [ 'user_id', ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sales');
  }
}
