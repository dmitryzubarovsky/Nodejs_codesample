import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableBankAccounts1666176032311 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'bank_accounts',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'cpf',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'bank_id',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'agency',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'account_number',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'city',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'state_id',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'user_id',
          type: 'int',
          isNullable: true,
        },
      ],
    }));

    await queryRunner.createForeignKey('bank_accounts', new TableForeignKey({
      columnNames: [ 'user_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bank_accounts');
  }

}
