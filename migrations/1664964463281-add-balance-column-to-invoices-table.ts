import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addBalanceColumnToInvoicesTable1664964463281 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('invoices', new TableColumn({
      name: 'balance',
      type: 'int',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('invoices', 'balance');
  }

}
