import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnIsLeaderToTransactionsTable1671643545903 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('transactions', new TableColumn({
      name: 'is_leader',
      type: 'boolean',
      default: false,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('transactions', 'is_leader');
  }

}
