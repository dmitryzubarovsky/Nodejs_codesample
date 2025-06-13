import { MigrationInterface, QueryRunner } from 'typeorm';

export class addRefundTransactionStatus1671476873026 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS \'Refund\';');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
