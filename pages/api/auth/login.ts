import faker from 'faker';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

import { comparePassword } from 'libs/encrypt';
import validate from 'libs/validate';

export type User = {
  readonly id: string;
  readonly username: string;
  readonly name: string;
  readonly picture: string;
  readonly bio: string;
};
export type ValidationError = {
  /**
   * Object that was validated.
   *
   */
  readonly target?: object;
  /**
   * Object's property that haven't pass validation.
   */
  readonly property: string;
  /**
   * Value that haven't pass a validation.
   */
  readonly value?: any;
  /**
   * Constraints that failed validation with error messages.
   */
  readonly constraints: {
    [type: string]: string;
  };
  /**
   * Contains all nested validation errors of the property.
   */
  readonly children: ValidationError[];
  /*
   * A transient set of data passed through to the validation result for response mapping
   */
  readonly contexts?: {
    [type: string]: any;
  };
};
export type Error = {
  readonly statusCode: number;
  readonly error: string;
  readonly message?: string | ValidationError[];
};

const usersDB = new Map<string, string>();
usersDB.set(
  'admin',
  'MTc3NzI2ZmE4ZTUwYThhMWFhNWU0MjBjNzQyNzRjZDI6MzBjY2Y5ZDAxMzFiNmZkNQ==',
); // Pa$$w0rd!
usersDB.set(
  'john_doe',
  'NWI0YTdhMGZhMjA1NmI3NTJmZjU1YWNmMjVmZTY2YjY6MzJlM2JjYzU3YTIxOTNkZA==',
); // Pa55w0rd!
usersDB.set(
  'jane_doe',
  'MmNmMzhiNTZlZjAwMmY4MTgzNWQ5MzJmMTI2ZGE4MTA6YTAxYjIyMjlkYzIwODhhMQ==',
); // !drowssap
faker.seed(6996);

/**
 * Mock backend endpoint
 */
export default (req: NextApiRequest, res: NextApiResponse<User | Error>) => {
  if (req.method !== 'POST')
    return res.status(405).send({
      statusCode: 405,
      error: 'Method Not Allowed',
    });

  const message = validate(req.body);

  if (message.length)
    return res.status(422).send({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message,
    });

  if (!usersDB.has(req.body.username))
    return res.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: `There isn't any user with username: ${req.body.username}`,
    });

  if (!comparePassword(usersDB.get(req.body.username), req.body.password))
    return res.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: `Wrong password for user with username: ${req.body.username}`,
    });

  const token = jwt.sign(
    { sub: req.body.username },
    process.env.APP_SECRET ?? '5€cr3t',
  );

  res.setHeader('Authorization', `Bearer ${token}`);
  res.setHeader('Set-Cookie', `token=s%3${token}; Path=/; HttpOnly`);

  res.json({
    id: faker.random.uuid(),
    username: req.body.username,
    name: faker.name.findName(),
    picture: faker.image.avatar(),
    bio: faker.lorem.paragraph(),
  });
};
