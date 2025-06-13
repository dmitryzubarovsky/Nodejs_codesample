import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class stripePaymentsTable1659348929022 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'stripe_payments',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'payment_id',
          type: 'varchar',
        },
        {
          name: 'charge_id',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'status',
          type: 'transaction_status_type',
          isNullable: true,
        },
        {
          name: 'delivered_at',
          type: 'timestamp',
          isNullable: true,
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('stripe_payments');
  }
}
