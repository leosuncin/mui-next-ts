import faker from 'faker';
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { comparePassword } from 'libs/encrypt';
import { ValidationError, validateLogin } from 'libs/validate';
import withDB from 'middlewares/with-db';

export type User = {
  readonly id: string;
  readonly username: string;
  readonly name: string;
  readonly picture: string;
  readonly bio: string;
};

export type Error = {
  readonly statusCode: number;
  readonly error: string;
  readonly message?: string | ValidationError[];
};

faker.seed(6996);

/**
 * Mock backend endpoint
 */
export default withDB((req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(HttpStatus.METHOD_NOT_ALLOWED);
    return res.send({
      statusCode: HttpStatus.METHOD_NOT_ALLOWED,
      error: HttpStatus.getStatusText(HttpStatus.METHOD_NOT_ALLOWED),
    });
  }

  const message = validateLogin(req.body);

  if (message.length)
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      error: HttpStatus.getStatusText(HttpStatus.UNPROCESSABLE_ENTITY),
      message,
    });

  if (!req.db.has(req.body.username))
    return res.status(HttpStatus.UNAUTHORIZED).send({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
      message: `There isn't any user with username: ${req.body.username}`,
    });

  if (!comparePassword(req.db.get(req.body.username), req.body.password))
    return res.status(HttpStatus.UNAUTHORIZED).send({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
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
});
