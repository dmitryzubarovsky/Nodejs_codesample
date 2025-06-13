import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableMailTokens1661332740069 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE mail_token_type AS ENUM (
    'registration',
    'invitation',
    'password_reset',
    'changing_email',
    'user_email_confirmation',
    'admin_email_confirmation'
    )`);
    await queryRunner.createTable(new Table({
      name: 'mail_tokens',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'token',
          type: 'uuid',
        },
        {
          name: 'type',
          type: 'mail_token_type',
        },
        {
          name: 'user_id',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'group_id',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'admin_id',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'new_email',
          type: 'varchar',
          isNullable: true,
        },
      ],
    }));
    await queryRunner.createForeignKeys('mail_tokens', [
      {
        columnNames: [ 'user_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      },
      {
        columnNames: [ 'group_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'groups',
        onDelete: 'CASCADE',
      },
      {
        columnNames: [ 'admin_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'admins',
        onDelete: 'CASCADE',
      },
    ].map(key => new TableForeignKey(key)));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mail_tokens');
    await queryRunner.query('DROP TYPE mail_token_type');
  }
}
