import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class changeUsersDocumentTable1666036767087 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users_documents', 'type');
    await queryRunner.query('DROP TYPE  IF EXISTS documents_type');

    await queryRunner.dropColumns('users', [ 'mei_id', 'signed_contract_id', ]);
    await queryRunner.addColumn('users', new TableColumn({
      name: 'document_id',
      type: 'int',
      isNullable: true,
    }));

    await queryRunner.createForeignKey('users', new TableForeignKey({
      columnNames: [ 'document_id', ],
      referencedColumnNames: [ 'id', ],
      referencedTableName: 'files',
      onDelete: 'CASCADE',
    }));

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE documents_type AS ENUM (
    'MEI',
    'Signed Contract'
    )`);

    await queryRunner.addColumn('documents_status', new TableColumn({
      name: 'comment',
      type: 'varchar',
      isNullable: true,
    }));
  }
}
