import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createHistorySalesTable1670335165717 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'sales_status_history',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'status',
          type: 'varchar',
        },
        {
          name: 'sale_id',
          type: 'int',
        },
      ],
    }));

    await queryRunner.createForeignKey('sales_status_history', new TableForeignKey({
      columnNames: [ 'sale_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'sales',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sales_status_history');
  }

}
