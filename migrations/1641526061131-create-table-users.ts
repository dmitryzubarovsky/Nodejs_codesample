import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableUsers1641526061131 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'users',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'confirmed_at',
          type: 'timestamp',
          isNullable: true,
        },
        {
          name: 'full_name',
          type: 'varchar',
        },
        {
          name: 'nickname',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'avatar_image_id',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'email',
          type: 'varchar',
        },
        {
          name: 'password',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'phone_number',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'cpf',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'profession',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'birth_date',
          type: 'date',
          isNullable: true,
        },
        {
          name: 'about',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'zip',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'country_id',
          type: 'int',
        },
        {
          name: 'state_id',
          type: 'int',
        },
        {
          name: 'city',
          type: 'varchar',
        },
        {
          name: 'district',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'street',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'house',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'apartment',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'company_id',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'refer_id',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'group_id',
          type: 'int',
          isNullable: true,
        },
      ],
    }));

    await queryRunner.createForeignKey('users', new TableForeignKey({
      columnNames: [ 'avatar_image_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'images',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('users', new TableForeignKey({
      columnNames: [ 'company_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'companies',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createIndex('users', new TableIndex({
      name: 'users_company_ids',
      columnNames: [ 'company_id', ],
    }));

    await queryRunner.createForeignKey('users', new TableForeignKey({
      columnNames: [ 'refer_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
