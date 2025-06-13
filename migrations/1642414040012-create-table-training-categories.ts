import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableTrainingCategories1642414040012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'training_categories',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'title',
          type: 'varchar',
        },
      ],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('training_categories');
  }
}
