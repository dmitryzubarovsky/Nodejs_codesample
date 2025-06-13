import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addCommentFieldToLeads1659034769197 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('leads', new TableColumn({
      name: 'comment',
      type: 'varchar',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('leads', 'comment');
  }
}
