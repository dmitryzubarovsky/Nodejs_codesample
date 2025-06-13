import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addLockedAtFieldInAdminTable1647857335755 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('admins', new TableColumn({
            name: 'locked_at',
            type: 'timestamp',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('admins', 'locked_at');
    }
}
