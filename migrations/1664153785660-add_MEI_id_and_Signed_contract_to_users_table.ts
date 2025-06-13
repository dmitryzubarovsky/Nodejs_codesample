import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class addMEIIdAndSignedContractToUsersTable1664153785660 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      {
        name: 'mei_id',
        type: 'int',
        isNullable: true,
      },
      {
        name: 'signed_contract_id',
        type: 'int',
        isNullable: true,
      },
    ].map(col => new TableColumn(col)));

    await queryRunner.createForeignKeys('users', [
      {
        columnNames: [ 'mei_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'files',
        onDelete: 'CASCADE',
      },
      {
        columnNames: [ 'signed_contract_id', ],
        referencedColumnNames: [ 'id', ],
        referencedTableName: 'files',
        onDelete: 'CASCADE',
      },
    ].map(key => new TableForeignKey(key)));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', [ 'mei_id', 'signed_contract_id', ]);
  }

}
