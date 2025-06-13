import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableVideos1642406264765 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'videos',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'third_party_video_id',
          type: 'int',
        },
        {
          name: 'third_party_video_type',
          type: 'varchar',
        },
        {
          name: 'preview_image_id',
          type: 'int',
        },
      ],
    }));

    await queryRunner.createForeignKey('videos', new TableForeignKey({
      columnNames: [ 'preview_image_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'images',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('videos');
  }
}
