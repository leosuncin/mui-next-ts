import { LevelDB } from '@nano-sql/adapter-leveldb';
import {
  InanoSQLConfig,
  InanoSQLFKActions,
} from '@nano-sql/core/lib/interfaces';
import { FuzzySearch, FuzzyUserSanitize } from '@nano-sql/plugin-fuzzy-search';

export const dbConfig: InanoSQLConfig = {
  id: 'mui-next',
  mode: process.env.NODE_ENV === 'test' ? 'TEMP' : new LevelDB('.next', true),
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
      queries: [
        {
          name: 'countByUsername',
          args: { 'username:string': { notNull: true } },
          call: (db, args: { username: string }) =>
            db
              .query('select', ['COUNT(*) AS total'])
              .where(['username', 'LIKE', args.username])
              .emit(),
        },
        {
          name: 'getByUsername',
          args: { 'username:string': { notNull: true } },
          call: (db, args: { username: string }) =>
            db
              .query('select')
              .where(['username', 'LIKE', args.username])
              .emit(),
        },
      ],
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
      queries: [
        {
          name: 'searchByText',
          args: {
            'search:string': {},
            'limit:number': {},
            'offset:number': {},
            'createdBy:uuid': {},
          },
          call: (db, args) =>
            db
              .query('select')
              .where(
                args.search
                  ? [
                      [
                        `SEARCH(text, "${FuzzyUserSanitize(args.search)}")`,
                        '=',
                        0,
                      ],
                      'AND',
                      ['createdBy', 'LIKE', args.createdBy],
                    ]
                  : ['createdBy', 'LIKE', args.createdBy],
              )
              .orderBy(['createdAt DESC'])
              .limit(args.limit)
              .offset(args.offset)
              .emit(),
        },
      ],
    },
  ],
  plugins: [FuzzySearch()],
};
export * from './users';
export * from './todos';
