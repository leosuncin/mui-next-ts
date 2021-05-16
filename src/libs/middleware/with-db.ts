import { nSQL } from '@nano-sql/core';

import { dbConfig, todos, users } from '@app/libs/db';
import { NextHttpHandler, ServiceUnavailableError } from '@app/types';

export function withDB(handler: NextHttpHandler): NextHttpHandler {
  return async (req, res) => {
    try {
      if (!nSQL().listDatabases().includes(dbConfig.id)) {
        await nSQL().createDatabase(dbConfig);
        await nSQL('users').loadJS(users);
        await nSQL('todos').loadJS(todos);
        await nSQL('todos').query('rebuild search').exec();
      }

      return handler(req, res);
    } catch (error) {
      throw new ServiceUnavailableError('Database connection error', error);
    }
  };
}
