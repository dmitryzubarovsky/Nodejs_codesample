import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTablePix1666176855470 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE pix_key_type AS ENUM (
    'cnpj',
    'cpf',
    'email',
    'phone',
    'bank account'
    )`);

    await queryRunner.createTable(new Table({
      name: 'pix',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'email',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'phone',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'cnpj',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'key',
          type: 'pix_key_type',
        },
        {
          name: 'cpf',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'bank_account_id',
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

    await queryRunner.createForeignKey('pix', new TableForeignKey({
      columnNames: [ 'bank_account_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'bank_accounts',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('pix', new TableForeignKey({
      columnNames: [ 'user_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('pix');
  }

}
