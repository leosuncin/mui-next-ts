import { nSQL } from '@nano-sql/core';
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { comparePassword } from 'libs/encrypt';
import { ValidationError, validateLogin } from 'libs/validate';
import withDB from 'middlewares/with-db';

export type Error = {
  readonly statusCode: number;
  readonly error: string;
  readonly message?: string | ValidationError[];
};

/**
 * Login a existing user
 */
export default withDB(async (req, res) => {
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

  const [user] = await nSQL('users')
    .presetQuery('getByUsername', { username: req.body.username })
    .exec();

  if (!user)
    return res.status(HttpStatus.UNAUTHORIZED).send({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
      message: `Wrong username: ${req.body.username}`,
    });

  if (!comparePassword(user.password, req.body.password))
    return res.status(HttpStatus.UNAUTHORIZED).send({
      statusCode: HttpStatus.UNAUTHORIZED,
      error: HttpStatus.getStatusText(HttpStatus.UNAUTHORIZED),
      message: `Wrong password for user: ${req.body.username}`,
    });

  delete user.password;
  const token = jwt.sign({ sub: user.id }, process.env.APP_SECRET ?? '5€cr3t');

  res.setHeader('Authorization', `Bearer ${token}`);
  res.setHeader('Set-Cookie', `token=s%3${token}; Path=/; HttpOnly`);

  res.json(user);
});
