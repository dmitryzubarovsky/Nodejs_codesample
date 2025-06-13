import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeTransactionAmountDatatype1655111442447 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE transactions ALTER COLUMN amount TYPE float USING amount::float');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE transactions ALTER COLUMN amount TYPE integer USING amount::integer;');
  }
}
