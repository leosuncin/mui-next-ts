import faker from 'faker';
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { hashPassword } from 'libs/encrypt';
import { validateRegister } from 'libs/validate';
import withDB from 'middlewares/with-db';

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

  const message = validateRegister(req.body);

  if (message.length)
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      error: HttpStatus.getStatusText(HttpStatus.UNPROCESSABLE_ENTITY),
      message,
    });

  if (req.db.has(req.body.email)) {
    return res.status(HttpStatus.CONFLICT).send({
      statusCode: HttpStatus.CONFLICT,
      error: HttpStatus.getStatusText(HttpStatus.CONFLICT),
      message: 'Username or Email already registered',
    });
  }
  req.db.set(req.body.email, hashPassword(req.body.password));

  const token = jwt.sign(
    { sub: req.body.email },
    process.env.APP_SECRET ?? '5€cr3t',
  );

  res.setHeader('Authorization', `Bearer ${token}`);
  res.setHeader('Set-Cookie', `token=s%3${token}; Path=/; HttpOnly`);

  res.json({
    id: faker.random.uuid(),
    username: req.body.email,
    name: req.body.firstName + ' ' + req.body.lastName,
    picture: faker.image.avatar(),
    bio: faker.lorem.paragraph(),
  });
});
