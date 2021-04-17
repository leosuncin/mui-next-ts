import { nSQL } from '@nano-sql/core';
import {
  catchErrors,
  validateMethod,
  withAuthentication,
  withDB,
} from 'libs/middleware';
import { NextHttpHandler, UserWithoutPassword as User } from 'types';

const findUsers: NextHttpHandler = async (request, response) => {
  const limit = Math.abs(
    Number.parseInt(request.query.limit as string, 10) || 10,
  );
  const page = Math.abs(Number.parseInt(request.query.page as string, 10) || 1);
  const offset = Math.abs(
    Number.parseInt(request.query.offset as string, 10) || 0,
  );

  const users = (await nSQL('users')
    .query('select', [
      'id',
      'firstName',
      'lastName',
      'username',
      'picture',
      'bio',
    ])
    .orderBy(['lastName DESC'])
    .limit(limit)
    .offset(offset > 0 ? offset : (page - 1) * limit)
    .exec()) as User[];

  response.json(users);
};

export default catchErrors(
  validateMethod(['GET'])(withDB(withAuthentication(findUsers))),
);
