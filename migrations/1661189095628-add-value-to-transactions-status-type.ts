import { MigrationInterface, QueryRunner } from 'typeorm';

export class addValueToTransactionsStatusType1661189095628 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TYPE transaction_status_type ADD VALUE \'Pre-processing\';');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
