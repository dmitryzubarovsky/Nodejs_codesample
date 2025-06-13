import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTransactionType1646064038383 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE transaction_type AS enum (\'Refill\', \'Pay out\')');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TYPE transaction_type');
  }
}
