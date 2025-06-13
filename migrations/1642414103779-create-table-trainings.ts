import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createTableTrainings1642414103779 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'trainings',
      columns: [
        ...commonTableMigrationsColumns,
        {
          name: 'video_id',
          type: 'int',
        },
        {
          name: 'is_ordered',
          type: 'boolean',
        },
        {
          name: 'category_id',
          type: 'int',
        },
      ],
    }));

    await queryRunner.createForeignKey('trainings', new TableForeignKey({
      columnNames: [ 'video_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'videos',
      onDelete: 'CASCADE',
    }));

    await queryRunner.createForeignKey('trainings', new TableForeignKey({
      columnNames: [ 'category_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'training_categories',
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('trainings');
  }
}
