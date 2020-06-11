import { tmpdir } from 'os';

import { LevelDB } from '@nano-sql/adapter-leveldb';
import { nSQL } from '@nano-sql/core';
import { InanoSQLConfig } from '@nano-sql/core/lib/interfaces';
import { NextApiRequest, NextApiResponse } from 'next';
import { Error } from 'pages/api/auth/login';

const dbConfig: InanoSQLConfig = {
  id: 'mui-next',
  mode: new LevelDB(tmpdir(), true),
  version: 1,
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
  ],
};

export type NextHttpHandler<T = Record<string, unknown>> = (
  req: NextApiRequest,
  res: NextApiResponse<T | Error>,
) => Promise<void> | void;

export default function withDbMiddleware(
  handler: NextHttpHandler,
): NextHttpHandler {
  return async function withDB(req, res) {
    if (!nSQL().listDatabases().includes(dbConfig.id))
      await nSQL().createDatabase(dbConfig);

    await nSQL('users').loadJS([
      {
        id: '760add88-0a2b-4358-bc3f-7d82245c5dea',
        firstName: 'John',
        lastName: 'Doe',
        username: 'admin',
        password:
          'MTc3NzI2ZmE4ZTUwYThhMWFhNWU0MjBjNzQyNzRjZDI6MzBjY2Y5ZDAxMzFiNmZkNQ==',
        name: 'Administrator',
        picture: 'https://i.pravatar.cc/200',
        bio:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      },
    ]);

    return handler(req, res);
  };
}
