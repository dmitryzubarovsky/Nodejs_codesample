import { TableColumnOptions } from 'typeorm';

export const commonTableMigrationsColumns: Array<TableColumnOptions> = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
  },
  {
    name: 'created_at',
    type: 'timestamp',
    isNullable: false,
    default: 'CURRENT_TIMESTAMP',
  },
  {
    name: 'updated_at',
    type: 'timestamp',
    isNullable: false,
    default: 'CURRENT_TIMESTAMP',
  },
  {
    name: 'deleted_at',
    type: 'timestamp',
    isNullable: true,
  },
];
