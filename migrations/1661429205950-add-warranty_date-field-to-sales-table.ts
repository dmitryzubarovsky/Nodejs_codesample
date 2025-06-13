import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addWarrantyDateFieldToSalesTable1661429205950 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('sales', new TableColumn({
      name: 'warranty_date',
      type: 'timestamp',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('sales', 'warranty_date');
  }
}
