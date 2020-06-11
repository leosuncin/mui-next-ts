import { nSQL } from '@nano-sql/core';
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { comparePassword } from 'libs/encrypt';
import { validateBody, validateMethod, withDB } from 'libs/middleware';
import { loginSchema } from 'libs/validation';

export type Error = {
  readonly statusCode: number;
  readonly message: string;
  readonly errors: Record<string, string>;
};

/**
 * Login a existing user
 */
export default withDB(
  validateMethod(
    ['POST'],
    validateBody(loginSchema, async (req, res) => {
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
      const token = jwt.sign(
        { sub: user.id },
        process.env.APP_SECRET ?? '5€cr3t',
      );

      res.setHeader('Authorization', `Bearer ${token}`);
      res.setHeader('Set-Cookie', `token=s%3${token}; Path=/; HttpOnly`);

      res.json(user);
    }),
  ),
);
