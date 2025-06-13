import { MigrationInterface, QueryRunner } from 'typeorm';

export class createdGroupUsersType1644230926768 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE group_users_type AS enum (\'Sent\', \'Reject\', \'Accepted\', \'Deleted\')');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TYPE group_users');
  }
}
