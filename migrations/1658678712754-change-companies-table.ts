import { MigrationInterface, QueryRunner, TableColumn, TableColumnOptions } from 'typeorm';

export class changeCompaniesTable1658678712754 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns: Array<TableColumnOptions> = [
      {
        name: 'country_id',
        type: 'int',
        isNullable: true,
      },
      {
        name: 'city',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'state_id',
        type: 'int',
        isNullable: true,
      },
      {
        name: 'line_first',
        type: 'varchar',
        isNullable: true,
      },
    ];
    await queryRunner.addColumns('companies', columns.map(col => new TableColumn(col)));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('companies', [ 'country_id', 'state_id', 'line_first', 'postal_code', ]);
  }
}
