import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTransactionsStatusType1659343618524 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE transaction_status_type AS enum (\'Successes\', \'Pending\',\'Processing\', \'Fail\')');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TYPE transaction_status_type');
  }
}
