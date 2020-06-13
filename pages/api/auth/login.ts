import { nSQL } from '@nano-sql/core';
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { comparePassword } from 'libs/encrypt';
import { validateBody, validateMethod, withDB } from 'libs/middleware';
import { loginSchema } from 'libs/validation';
import { setCookie } from 'nookies';
import { User } from 'types';

/**
 * Login a existing user
 */
const login = async (req, res) => {
  const [user] = (await nSQL('users')
    .presetQuery('getByUsername', { username: req.body.username })
    .exec()) as [User];

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
  validateBody(loginSchema, withDB(login)),
);
