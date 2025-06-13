import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class changeCompanyFields1652441307052 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('companies', [ 'type', 'title', ]);
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'legal_nature_id',
        type: 'int',
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      'companies',
      new TableColumn({
        name: 'attachment_id',
        type: 'int',
        isNullable: true,
      })
    );
    await queryRunner.createForeignKey(
      'companies',
      new TableForeignKey({
        columnNames: [ 'attachment_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'files',
        onDelete: 'SET NULL',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns(
      'companies',
      [
        {
          name: 'type',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'title',
          type: 'varchar',
          isNullable: true,
        },
      ].map((col) => new TableColumn(col))
    );
    await queryRunner.dropColumn('companies', 'legal_nature_id');
    await queryRunner.dropColumn('companies', 'attachment_id');
  }
}
