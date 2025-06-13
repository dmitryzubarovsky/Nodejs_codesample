import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey
} from 'typeorm';

export class createContentComplaintTable1647427411095 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'content_complaints',
        columns: [
          {
            name: 'complaint_id',
            type: 'int',
          },
          {
            name: 'user_image_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'group_image_id',
            type: 'int',
            isNullable: true,
          },
        ],
      })
    );
    const foreignKeys = [
      {
        columnNames: [ 'complaint_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'complaints',
        onDelete: 'CASCADE',
      },
      {
        columnNames: [ 'user_image_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'user_images',
        onDelete: 'CASCADE',
      },
    ].map(key => new TableForeignKey(key));
    await queryRunner.createForeignKeys('content_complaints', foreignKeys);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('content_complaints');
  }
}
