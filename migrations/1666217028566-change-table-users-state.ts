import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class changeTableUsersState1666217028566 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.addColumn('users', new TableColumn({
      name: 'temp_state_id',
      type: 'int',
      isNullable: true,
    }));

    await queryRunner.query('Update users SET temp_state_id = state_id');
    await queryRunner.changeColumn('users', 'state_id', new TableColumn({
      name: 'state_id',
      type: 'int',
      isNullable: true,
    }));
    await queryRunner.query('Update users SET state_id = temp_state_id');
    await queryRunner.dropColumn('users', 'temp_state_id');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.changeColumn('users', 'state_id', new TableColumn({
      name: 'state_id',
      type: 'int',
      isNullable: false,
    }));
  }

}
