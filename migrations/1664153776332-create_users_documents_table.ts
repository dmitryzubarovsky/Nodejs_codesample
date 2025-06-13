import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createUsersDocumentsTable1664153776332 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE documents_status AS ENUM (
    'Verified',
    'Processing',
    'Not verified',
    'Not loaded'
    )`);

    await queryRunner.query(`CREATE TYPE documents_type AS ENUM (
    'MEI',
    'Signed Contract'
    )`);

    await queryRunner.createTable(new Table({
      name: 'users_documents',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'status',
          type: 'documents_status',
        },
        {
          name: 'type',
          type: 'documents_type',
        },
        {
          name: 'user_id',
          type: 'int',
        },
        {
          name: 'file_id',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'comment',
          type: 'varchar',
          isNullable: true,
        },
      ],
    }));
    await queryRunner.createForeignKeys('users_documents', [
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
    await queryRunner.dropTable('users_documents');
    await queryRunner.query('DROP TYPE documents_status');
    await queryRunner.query('DROP TYPE documents_type');
  }

}
