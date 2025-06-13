import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from 'typeorm';

export class deleteGroupIdField1648213047499 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'group_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
        name: 'group_id',
        type: 'int',
        isNullable: true,
      })
    );
    await queryRunner.createForeignKey('users', new TableForeignKey({
        name: 'user_group_foreign_key',
        columnNames: [ 'group_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'groups',
        onDelete: 'SET NULL',
      })
    );
  }
}
