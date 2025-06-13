import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixCommissionAmount1669682919880 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV === 'prod') {
      const query = `DELETE FROM sales WHERE id  IN (57, 60, 62, 70, 71, 109, 111, 112, 121, 122, 123, 124, 149, 150, 125, 127, 133, 151, 155, 157);
        DELETE FROM transactions WHERE id  IN  (65, 66, 67, 68, 69, 85, 87, 88, 89, 90, 91, 92, 93, 95, 97, 98, 101, 102, 103, 70, 99, 100);`;

      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> { }
}
