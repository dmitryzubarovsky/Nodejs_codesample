import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';
import { commonTableMigrationsColumns } from '../src/common/constants';

export class createdGroupUsersTable1644238247619 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'group_users',
            columns: [
                ...commonTableMigrationsColumns,
                {
                    name: 'user_id',
                    type: 'int',
                },
                {
                    name: 'group_id',
                    type: 'int',
                },
                {
                    name: 'status',
                    type: 'enum',
                    enumName: 'group_users_type',
                },
                {
                    name: 'role',
                    type: 'enum',
                    enumName: 'group_users_role',
                },
            ],
        }));

        await queryRunner.dropColumn('groups', 'creator_id');

        await queryRunner.createForeignKey('group_users', new TableForeignKey({
            columnNames: [ 'user_id', ],
            referencedColumnNames: [ 'id', ],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('group_users', new TableForeignKey({
            columnNames: [ 'group_id', ],
            referencedColumnNames: [ 'id', ],
            referencedTableName: 'groups',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('group_id');

        await queryRunner.addColumn('groups', new TableColumn({
            name: 'creator_id',
            type: 'int',
        }));

        await queryRunner.createForeignKey('groups', new TableForeignKey({
            columnNames: [ 'creator_id', ],
            referencedColumnNames: [ 'id', ],
            referencedTableName: 'users',
            onDelete: 'SET NULL',
        }));
    }
}
