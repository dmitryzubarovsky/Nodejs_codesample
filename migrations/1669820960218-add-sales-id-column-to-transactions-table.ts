import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class addSalesIdColumnToTransactionsTable1669820960218 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('transactions', new TableColumn({
      name: 'sale_id',
      type: 'int',
      isNullable: true,
    }));

    await queryRunner.createForeignKey('transactions', new TableForeignKey({
      columnNames: [ 'sale_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'sales',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', 'sales_id');
  }
}
