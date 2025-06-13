import { MigrationInterface, QueryRunner, TableColumn, TableColumnOptions } from 'typeorm';

export class addFieldsToSalesTable1643712540731 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns: Array<TableColumnOptions> = [
      {
        name: 'client_email',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'client_phone_number',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'client_country',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'client_state',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'client_city',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'client_district',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'price',
        type: 'int',
        isNullable: true,
      },
    ];
    await queryRunner.addColumns('sales', columns.map(col => new TableColumn(col)));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('sales', [
      'client_email', 'client_phone_number', 'client_country',
      'client_state', 'client_city', 'client_district', 'price',
    ]);
  }
}
