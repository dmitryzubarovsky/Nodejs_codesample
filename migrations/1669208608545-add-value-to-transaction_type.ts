import { MigrationInterface, QueryRunner } from 'typeorm';

export class addValueToTransactionType1669208608545 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TYPE transaction_type ADD VALUE \'Refund\'');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
