import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableImages1641525935743 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'images',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'file_id',
          type: 'int',
          isNullable: false,
        },
      ],
    }));

    await queryRunner.createForeignKey('images', new TableForeignKey({
      columnNames: [ 'file_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'files',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('images');
  }
}
