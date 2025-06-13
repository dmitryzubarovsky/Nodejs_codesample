import { MigrationInterface, QueryRunner, TableForeignKey, TableIndex } from 'typeorm';

export class addGroupRelationToUser1641526623920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey('users', new TableForeignKey({
      name: 'user_group_foreign_key',
      columnNames: [ 'group_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'groups',
      onDelete: 'SET NULL',
    }));

    await queryRunner.createIndex('users', new TableIndex({
      name: 'user_group_ids',
      columnNames: [ 'group_id', ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('users', 'user_group_ids');
    await queryRunner.dropForeignKey('users', 'user_group_foreign_key');
  }
}
