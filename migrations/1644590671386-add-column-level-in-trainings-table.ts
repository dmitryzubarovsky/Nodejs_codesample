import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnLevelInTrainingsTable1644590671386 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('trainings', new TableColumn({
            name: 'level_id',
            type: 'int',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('trainings', 'level_id');
    }

}
