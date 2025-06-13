import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addLockedAtField1643192581988 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'locked_at',
      type: 'timestamp',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'locked_at');
  }
}
