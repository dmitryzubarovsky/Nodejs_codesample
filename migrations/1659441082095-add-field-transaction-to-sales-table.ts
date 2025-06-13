import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFieldTransactionToSalesTable1659441082095 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('sales', [
      {
        name: 'hotmart_transaction_code',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'payment_type',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'recurrency_period',
        type: 'varchar',
        isNullable: true,
      },
    ].map(col => new TableColumn(col)));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('sales', [ 'hotmart_transaction_code', 'recurrency_period', 'payment_type', ]);
  }
}
