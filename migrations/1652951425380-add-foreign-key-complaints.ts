import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm';

export class addForeignKeyComplaints1652951425380 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      'content_complaints',
      new TableForeignKey({
        name: 'complaints_groups',
        columnNames: [ 'group_image_id', ],
        referencedTableName: 'group_images',
        referencedColumnNames: [ 'id', ],
        onDelete: 'CASCADE',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('content_complaints', 'complaints_groups');
  }
}
