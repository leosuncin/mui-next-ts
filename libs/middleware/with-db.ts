import { tmpdir } from 'os';

import { LevelDB } from '@nano-sql/adapter-leveldb';
import { nSQL } from '@nano-sql/core';
import {
  InanoSQLConfig,
  InanoSQLFKActions,
} from '@nano-sql/core/lib/interfaces';
import { FuzzySearch, FuzzyUserSanitize } from '@nano-sql/plugin-fuzzy-search';
import { NextHttpHandler } from 'types';

const dbConfig: InanoSQLConfig = {
  id: 'mui-next',
  mode: new LevelDB(tmpdir(), true),
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

export function withDB(handler: NextHttpHandler): NextHttpHandler {
  return async function withDB(req, res) {
    if (!nSQL().listDatabases().includes(dbConfig.id)) {
      await nSQL().createDatabase(dbConfig);
      await nSQL('users').loadJS([
        {
          id: '760add88-0a2b-4358-bc3f-7d82245c5dea',
          firstName: 'John',
          lastName: 'Doe',
          username: 'admin',
          password:
            'MTc3NzI2ZmE4ZTUwYThhMWFhNWU0MjBjNzQyNzRjZDI6MzBjY2Y5ZDAxMzFiNmZkNQ==',
          picture: 'https://i.pravatar.cc/200',
          bio:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        {
          id: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
          firstName: 'Jane',
          lastName: 'Doe',
          username: 'jane_doe',
          password:
            'OTQ1Yzk1NWVlYWI3ZDNkOWYyMjA4MGI1YjIwMmI4MzA6MWIzMmQxMDUwZjRlMTFiMw==',
          picture: 'https://i.pravatar.cc/200',
          bio:
            'She had this enormous capacity for wonder, and lived by the Golden Rule.',
        },
      ]);
      await nSQL('todos').loadJS([
        {
          id: '66459160-2390-4532-900b-8399586ac2c5',
          text: 'Make a sandwich',
          done: false,
          createdBy: '760add88-0a2b-4358-bc3f-7d82245c5dea',
        },
        {
          id: 'bcf13961-75a5-44a4-9ed6-2c15d25424ae',
          text: 'Make a salad',
          done: true,
          createdBy: '760add88-0a2b-4358-bc3f-7d82245c5dea',
        },
      ]);
      await nSQL('todos').query('rebuild search').exec();
    }

    return handler(req, res);
  };
}
