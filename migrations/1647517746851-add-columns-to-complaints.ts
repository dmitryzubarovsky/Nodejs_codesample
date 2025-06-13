import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey
} from 'typeorm';

export class addColumnsToComplaints1647517746851 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('complaints', [
      new TableColumn({
        name: 'user_id',
        type: 'int',
        isNullable: true,
      }),
      new TableColumn({
        name: 'group_id',
        type: 'int',
        isNullable: true,
      }),
    ]);
    await queryRunner.createForeignKeys('complaints', [
      new TableForeignKey({
        columnNames: [ 'user_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: [ 'group_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'groups',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('complaints', [ 'user_id', 'group_id', ]);
  }
}
