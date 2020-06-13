import { nSQL } from '@nano-sql/core';
import faker from 'faker';
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { hashPassword } from 'libs/encrypt';
import { validateBody, validateMethod, withDB } from 'libs/middleware';
import { registerSchema } from 'libs/validation';
import { setCookie } from 'nookies';
import { User } from 'types';

/**
 * Register a new a user
 */
const register = async (req, res) => {
  const [{ total }] = await nSQL('users')
    .presetQuery('countByUsername', { username: req.body.username })
    .exec();

  if (total > 0) {
    return res.status(HttpStatus.CONFLICT).send({
      statusCode: HttpStatus.CONFLICT,
      error: HttpStatus.getStatusText(HttpStatus.CONFLICT),
      message: 'Username or Email already registered',
    });
  }

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

  const token = jwt.sign({ sub: user.id }, process.env.APP_SECRET ?? '5€cr3t');

  res.setHeader('Authorization', `Bearer ${token}`);
  setCookie({ res }, 'token', token, {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
  });

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    picture: user.picture,
    bio: user.bio,
  });
};

export default validateMethod(
  ['POST'],
  validateBody(registerSchema, withDB(register)),
);
