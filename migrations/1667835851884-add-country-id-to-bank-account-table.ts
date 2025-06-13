import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addCountryIdToBankAccountTable1667835851884 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('bank_accounts', new TableColumn({
      name: 'country_id',
      type: 'int',
      isNullable: true,
      default: 1,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('pix', 'country_id');
  }
}
