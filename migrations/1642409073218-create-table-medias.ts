import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableMedias1642409073218 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'medias',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'title',
          type: 'varchar',
        },
        {
          name: 'video_id',
          type: 'int',
        },
        {
          name: 'description',
          type: 'varchar',
        },
      ],
    }));

    await queryRunner.createForeignKey('medias', new TableForeignKey({
      columnNames: [ 'video_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'videos',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('medias');
  }
}
