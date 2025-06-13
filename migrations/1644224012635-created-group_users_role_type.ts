import { MigrationInterface, QueryRunner } from 'typeorm';

export class createdGroupUsersRoleType1644224012635 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE group_users_role AS enum (\'Admin\', \'User\')');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP TYPE group_users_role');
  }
}
