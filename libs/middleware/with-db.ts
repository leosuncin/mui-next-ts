import { nSQL } from '@nano-sql/core';
import { dbConfig, todos, users } from 'libs/db';
import { NextHttpHandler, ServiceUnavailableError } from 'types';

export function withDB(handler: NextHttpHandler): NextHttpHandler {
  return async (request, response) => {
    try {
      if (!nSQL().listDatabases().includes(dbConfig.id)) {
        await nSQL().createDatabase(dbConfig);
        await nSQL('users').loadJS(users);
        await nSQL('todos').loadJS(todos);
        await nSQL('todos').query('rebuild search').exec();
      }

      await handler(request, response);
      return;
    } catch (error: unknown) {
      throw new ServiceUnavailableError(
        'Database connection error',
        error as Error,
      );
    }
  };
}
