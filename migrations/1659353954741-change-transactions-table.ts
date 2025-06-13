import { MigrationInterface, QueryRunner, TableColumn, TableColumnOptions, TableForeignKey } from 'typeorm';

export class changeTransactionsTable1659353954741 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns: Array<TableColumnOptions> = [
      {
        name: 'status',
        type: 'transaction_status_type',
        isNullable: true,
      },
      {
        name: 'stripe_payment_id',
        type: 'int',
        isNullable: true,
      },
      {
        name: 'transfer_id',
        type: 'varchar',
        isNullable: true,
      },
    ];
    await queryRunner.addColumns('transactions', columns.map(col => new TableColumn(col)));

    await queryRunner.createForeignKey(
      'transactions',
      new TableForeignKey({
        columnNames: [ 'stripe_payment_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'stripe_payments',
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('transactions', [ 'status', 'charge_id', ]);
  }
}
