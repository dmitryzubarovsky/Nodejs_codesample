import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class changeVideoTable1644564044777 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('videos', 'third_party_video_id', new TableColumn({
      name: 'third_party_video_id',
      type: 'varchar',
    }));

    await queryRunner.changeColumn('videos', 'preview_image_id', new TableColumn({
      name: 'preview_image_id',
      type: 'int',
      isNullable: true,
    }));

    await queryRunner.dropColumn('videos', 'third_party_video_type');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn('videos', 'third_party_video_id', new TableColumn({
      name: 'third_party_video_id',
      type: 'int',
    }));

    await queryRunner.changeColumn('videos', 'preview_image_id', new TableColumn({
      name: 'preview_image_id',
      type: 'int',
    }));

    await queryRunner.addColumn('videos', new TableColumn({
      name: 'third_party_video_type',
      type: 'varchar',
    }));
  }
}
