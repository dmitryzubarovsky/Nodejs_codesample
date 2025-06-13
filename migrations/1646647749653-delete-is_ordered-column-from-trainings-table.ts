import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class deleteIsOrderedColumnFromTrainingsTable1646647749653 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn('trainings', 'is_ordered');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn('trainings', new TableColumn( {
          name: 'is_ordered',
          type: 'boolean',
      }));
  }

}
