import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addFieldsToTrainings1647350193601 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const columns = [
      {
        name: 'title',
        type: 'varchar',
        isNullable: true,
      },
      {
        name: 'description',
        type: 'varchar',
        isNullable: true,
      },
    ].map(col => new TableColumn(col));
    await queryRunner.addColumns('trainings', columns);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('trainings', [ 'title', 'description', ]);
  }
}
