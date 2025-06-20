import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addColumnStripeIdToUsersTable1658680674653 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'stripe_account_id',
      type: 'varchar',
      isNullable: true,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'stripe_id');
  }

}
