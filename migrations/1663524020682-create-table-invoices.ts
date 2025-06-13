import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableInvoices1663524020682 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE invoices_status AS ENUM (
    'Analysis',
    'Rejected',
    'Accepted'
    )`);

    await queryRunner.createTable(new Table({
      name: 'invoices',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'comment',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'status',
          type: 'invoices_status',
        },
        {
          name: 'user_id',
          type: 'int',
        },
        {
          name: 'file_id',
          type: 'int',
        },
      ],
    }));
    await queryRunner.createForeignKeys('invoices', [
      {
        columnNames: [ 'user_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      },
      {
        columnNames: [ 'file_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'files',
        onDelete: 'CASCADE',
      },
    ].map(key => new TableForeignKey(key)));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('invoices');
    await queryRunner.query('DROP TYPE invoices_status');
  }

}
