import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class deleteBankAndCompany1660308364698 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'company_id');
    await queryRunner.dropTable('companies');
    await queryRunner.dropTable('bank_accounts');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'companies',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'name',
          type: 'varchar',
        },
        {
          name: 'title',
          type: 'varchar',
        },
        {
          name: 'cnpj',
          type: 'varchar',
        },
        {
          name: 'address',
          type: 'varchar',
        },
        {
          name: 'email',
          type: 'varchar',
        },
        {
          name: 'type',
          type: 'varchar',
        },
      ],
    }));

    await queryRunner.addColumn('users', new TableColumn({
      name: 'company_id',
      type: 'int',
      isNullable: true,
    }));
    await queryRunner.createForeignKey('users', new TableForeignKey({
      columnNames: [ 'company_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'companies',
      onDelete: 'CASCADE',
    }));
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
}
