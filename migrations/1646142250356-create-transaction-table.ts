import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTransactionTable1646142250356 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'transactions',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'user_id',
          type: 'int',
        },
        {
          name: 'amount',
          type: 'int',
        },
        {
          name: 'type',
          type: 'transaction_type',
        },
        {
          name: 'currency',
          type: 'varchar',
        },
      ],
    }));

    await queryRunner.createForeignKey('transactions', new TableForeignKey({
      columnNames: [ 'user_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('transactions');
  }

}
