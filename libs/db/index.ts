import os from 'os';

import { LevelDB } from '@nano-sql/adapter-leveldb';
import {
  InanoSQLConfig,
  InanoSQLFKActions,
} from '@nano-sql/core/lib/interfaces';
import { FuzzySearch } from '@nano-sql/plugin-fuzzy-search';

export const dbConfig: InanoSQLConfig = {
  id: 'mui-next',
  mode:
    process.env.NODE_ENV === 'test' ? 'TEMP' : new LevelDB(os.tmpdir(), true),
  version: 2,
  tables: [
    {
      name: 'users',
      model: {
        'id:uuid': { pk: true },
        'firstName:string': { notNull: true },
        'lastName:string': { notNull: true },
        'username:string': { notNull: true, immutable: true },
        'password:string': { notNull: true },
        'picture:string': {},
        'bio:string': {},
      },
      indexes: {
        'username:string': { unique: true, ignore_case: true },
      },
    },
    {
      name: 'todos',
      model: {
        'id:uuid': { pk: true },
        'text:string': { notNull: true, max: 140 },
        'done:boolean': { default: false },
        'createdAt:date': { default: () => new Date() },
        'updatedAt:date': { default: () => new Date() },
        'createdBy:uuid': { notNull: true },
      },
      indexes: {
        'text:string': { search: true },
        'createdBy:uuid': {
          foreignKey: {
            target: 'users.id',
            onDelete: InanoSQLFKActions.RESTRICT,
          },
        },
      },
    },
  ],
  plugins: [FuzzySearch()],
};
export * from './users';
export * from './todos';
