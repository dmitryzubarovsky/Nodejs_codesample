import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableGroupImages1641526697524 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'group_images',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'image_id',
          type: 'int',
        },
        {
          name: 'group_id',
          type: 'int',
        },
      ],
    }));

    await queryRunner.createForeignKey('group_images', new TableForeignKey({
      columnNames: [ 'group_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'groups',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createIndex('group_images', new TableIndex({
      name: 'group_images_group_ids',
      columnNames: [ 'group_id', ],
    }));

    await queryRunner.createForeignKey('group_images', new TableForeignKey({
      columnNames: [ 'image_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'images',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('group_images');
  }
}
