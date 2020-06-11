import { nSQL } from '@nano-sql/core';
import faker from 'faker';
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { hashPassword } from 'libs/encrypt';
import { withDB } from 'libs/middleware';
import { validateRegister } from 'libs/validate';

/**
 * Register a new a user
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

  const message = validateRegister(req.body);

  if (message.length)
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      error: HttpStatus.getStatusText(HttpStatus.UNPROCESSABLE_ENTITY),
      message,
    });

  const [{ total }] = await nSQL('users')
    .presetQuery('countByUsername', { username: req.body.email })
    .exec();

  if (total > 0) {
    return res.status(HttpStatus.CONFLICT).send({
      statusCode: HttpStatus.CONFLICT,
      error: HttpStatus.getStatusText(HttpStatus.CONFLICT),
      message: 'Username or Email already registered',
    });
  }

  const [user] = await nSQL('users')
    .query('upsert', {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.email,
      password: hashPassword(req.body.password),
      picture: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
    })
    .exec();

  const token = jwt.sign({ sub: user.id }, process.env.APP_SECRET ?? '5€cr3t');

  res.setHeader('Authorization', `Bearer ${token}`);
  res.setHeader('Set-Cookie', `token=s%3${token}; Path=/; HttpOnly`);
  delete user.password;

  res.json(user);
});
