import { nSQL } from '@nano-sql/core';
import faker from 'faker';
import { hashPassword } from 'libs/encrypt';
import { signJWT } from 'libs/jwt';
import {
  catchErrors,
  validateBody,
  validateMethod,
  withDB,
} from 'libs/middleware';
import { registerSchema } from 'libs/validation';
import { setCookie } from 'nookies';
import { ConflictError, NextHttpHandler, User } from 'types';

/**
 * Register a new a user
 */
const register: NextHttpHandler = async (req, res) => {
  const [{ total }] = await nSQL('users')
    .query('select', ['COUNT(*) AS total'])
    .where(['username', 'LIKE', req.body.username])
    .exec();

  if (total > 0)
    throw new ConflictError('Username or Email already registered');

  const [user] = (await nSQL('users')
    .query('upsert', {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hashPassword(req.body.password),
      picture: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
    })
    .exec()) as [User];

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
  validateMethod(['POST'])(validateBody(registerSchema)(withDB(register))),
);
