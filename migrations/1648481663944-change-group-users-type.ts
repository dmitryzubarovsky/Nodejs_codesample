import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeGroupUsersType1648481663944 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE group_users alter status type text;
          DROP type group_users_type;
          CREATE type group_users_type as enum ('Sent', 'Rejected', 'Accepted');
          ALTER TABLE group_users ALTER status type group_users_type using status::group_users_type;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
