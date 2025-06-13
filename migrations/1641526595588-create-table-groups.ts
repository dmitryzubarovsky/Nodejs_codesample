import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableGroups1641526595588 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'groups',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'name',
          type: 'varchar',
        },
        {
          name: 'avatar_image_id',
          type: 'int',
          isNullable: true,
        },
        {
          name: 'creator_id',
          type: 'int',
          isNullable: false,
        },
      ],
    }));

    await queryRunner.createForeignKey('groups', new TableForeignKey({
      columnNames: [ 'creator_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
    }));

    await queryRunner.createIndex('groups', new TableIndex({
      name: 'group_creator_ids',
      columnNames: [ 'creator_id', ],
    }));

    await queryRunner.createForeignKey('groups', new TableForeignKey({
      columnNames: [ 'avatar_image_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'images',
      onDelete: 'SET NULL',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('groups');
  }
}
