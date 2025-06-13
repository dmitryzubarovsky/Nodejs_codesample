import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableUserImages1641526679237 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'user_images',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'user_id',
          type: 'int',
        },
        {
          name: 'image_id',
          type: 'int',
        },
      ],
    }));

    await queryRunner.createForeignKey('user_images', new TableForeignKey({
      columnNames: [ 'user_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'users',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createIndex('user_images', new TableIndex({
      name: 'user_image_user_ids',
      columnNames: [ 'user_id', ],
    }));

    await queryRunner.createForeignKey('user_images', new TableForeignKey({
      columnNames: [ 'image_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'images',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_images');
  }
}
