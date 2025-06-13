import { MigrationInterface, QueryRunner, TableColumn, TableColumnOptions } from 'typeorm';

export class dropColumnsBirthDateAndCommentFromLeads1645192320751 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('leads', [ 'comment', 'birth_date', ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columns: Array<TableColumnOptions> = [
        {
            name: 'birth_date',
            type: 'date',
            isNullable: true,
        },
        {
            name: 'comment',
            type: 'varchar',
            isNullable: true,
        },
    ];
    await queryRunner.addColumns('leads', columns.map(col => new TableColumn(col)));
  }
}
