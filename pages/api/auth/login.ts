import { nSQL } from '@nano-sql/core';
import { comparePassword } from 'libs/encrypt';
import { signJWT } from 'libs/jwt';
import {
  catchErrors,
  validateBody,
  validateMethod,
  withDB,
} from 'libs/middleware';
import { loginSchema } from 'libs/validation';
import { setCookie } from 'nookies';
import { NextHttpHandler, UnauthorizedError, User } from 'types';

/**
 * Login a existing user
 */
const login: NextHttpHandler = async (req, res) => {
  const [user] = (await nSQL('users')
    .query('select')
    .where(['username', 'LIKE', req.body.username])
    .exec()) as [User];

  if (!user)
    throw new UnauthorizedError(`Wrong username: ${req.body.username}`);

  if (!comparePassword(user.password, req.body.password))
    throw new UnauthorizedError(
      `Wrong password for user: ${req.body.username}`,
    );

  const token = signJWT(user);
  const userWithoutPassword = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    picture: user.picture,
    bio: user.bio,
  };

  res.setHeader('Authorization', `Bearer ${token}`);
  setCookie({ res }, 'token', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    maxAge: 30 * 24 * 3600, // 30 days
  });
  setCookie({ res }, 'sessionUser', JSON.stringify(userWithoutPassword), {
    path: '/',
    sameSite: 'strict',
  });

  res.json(userWithoutPassword);
};

export default catchErrors(
  validateMethod(['POST'])(validateBody(loginSchema)(withDB(login))),
);
