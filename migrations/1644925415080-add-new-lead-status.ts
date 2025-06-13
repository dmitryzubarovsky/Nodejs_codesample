import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNewLeadStatus1644925415080 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TYPE lead_status ADD VALUE \'New lead\'');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
