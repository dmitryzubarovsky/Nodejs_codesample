import { MigrationInterface, QueryRunner } from 'typeorm';

export class makeAllEmailsCaseInsensitive1674632821709 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('UPDATE users SET email=LOWER(email);');
    await queryRunner.query('UPDATE admins SET email=LOWER(email);');
    await queryRunner.query('UPDATE pix SET email=LOWER(email);');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    // impossible to down
  }
}
