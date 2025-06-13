import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class modifyLevelPermissionColumns1645471984479 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('trainings', 'level_id');
    await queryRunner.addColumn('trainings', new TableColumn({
      name: 'level',
      type: 'int',
      isNullable: true,
    }));
    await queryRunner.addColumn('training_categories', new TableColumn({
      name: 'level',
      type: 'int',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('training_categories', 'level');
    await queryRunner.dropColumn('trainings', 'level');
    await queryRunner.addColumn('trainings', new TableColumn({
      name: 'level_id',
      type: 'int',
      isNullable: true,
    }));
  }
}
