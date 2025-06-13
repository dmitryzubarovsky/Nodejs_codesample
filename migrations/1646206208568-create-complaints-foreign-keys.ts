import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class createComplaintsForeignKeys1646206208568 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const complaintIdColumn = new TableColumn({
      name: 'complaint_id',
      type: 'int',
      isNullable: true,
    });
    await queryRunner.addColumn('users', complaintIdColumn);
    await queryRunner.addColumn('groups', complaintIdColumn);
    await queryRunner.addColumn('user_images', complaintIdColumn);
    await queryRunner.addColumn('group_images', complaintIdColumn);

    const complaintForeignKey = new TableForeignKey({
      columnNames: [ 'complaint_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'complaints',
      onDelete: 'SET NULL',
    });

    await queryRunner.createForeignKey('users', complaintForeignKey);
    await queryRunner.createForeignKey('groups', complaintForeignKey);
    await queryRunner.createForeignKey('user_images', complaintForeignKey);
    await queryRunner.createForeignKey('group_images', complaintForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'complaint_id');
    await queryRunner.dropColumn('groups', 'complaint_id');
    await queryRunner.dropColumn('user_images', 'complaint_id');
    await queryRunner.dropColumn('group_images', 'complaint_id');
  }
}
