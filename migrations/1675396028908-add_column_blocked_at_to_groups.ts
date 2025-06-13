import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnBlockedAtToGroups1675396028908 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('groups', new TableColumn({
      name: 'blocked_at',
      type: 'timestamp',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('groups', 'blocked_at');
  }

}
