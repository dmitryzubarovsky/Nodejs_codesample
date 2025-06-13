import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableBankAccounts1641526655580 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'bank_accounts',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'bank_id',
          type: 'int',
        },
        {
          name: 'agency_id',
          type: 'int',
        },
        {
          name: 'account_number',
          type: 'varchar',
        },
        {
          name: 'account_type',
          type: 'varchar',
        },
        {
          name: 'user_id',
          type: 'int',
        },
      ],
    }));

    await queryRunner.createForeignKey('bank_accounts', new TableForeignKey({
      columnNames: [ 'user_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createIndex('bank_accounts', new TableIndex({
      name: 'bank_account_user_ids',
      columnNames: [ 'user_id', ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bank_accounts');
  }
}
