import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnUniqKeyToUsersTable1668446002459 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'uniq_key',
      type: 'varchar',
      isNullable: true,
    }));

    await queryRunner.query('Update users SET uniq_key = gen_random_uuid() WHERE uniq_key IS NULL');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'uniq_key');
  }
}
