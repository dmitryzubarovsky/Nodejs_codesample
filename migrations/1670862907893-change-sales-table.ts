import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeSalesTable1670862907893 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV!= 'prod') {
      const query = 'create unique index IF NOT EXISTS sales_hotmart_transaction_code_uindex on sales (hotmart_transaction_code);';
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }
}
