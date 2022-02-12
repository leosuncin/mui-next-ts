import { StatusCodes } from 'http-status-codes';
import { RequestHandler, rest } from 'msw';

import { signJWT } from '@app/libs/jwt';
import { registerSchema as validationSchema } from '@app/libs/validation';
import type { AuthRegister, User } from '@app/types';
import { db } from '@app/utils/db';

const registerHandler: RequestHandler = rest.post(
  '/api/auth/register',
  (req, res, ctx) => {
    const { firstName, lastName, username } = req.body as AuthRegister;
    const user = db.users.findFirst({
      where: { username: { equals: username } },
    }) as unknown as User;

    try {
      validationSchema.validateSync(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error) {
      return res(
        ctx.status(StatusCodes.UNPROCESSABLE_ENTITY),
        ctx.json({
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          message: 'Validation errors',
          errors: error.inner.reduce(
            (prev, error) => ({ ...prev, [error.path]: error.errors[0] }),
            {},
          ),
        }),
      );
    }

    if (user) {
      return res(
        ctx.status(StatusCodes.CONFLICT),
        ctx.json({
          statusCode: StatusCodes.CONFLICT,
          message: 'Username or Email already registered',
        }),
      );
    }

    const newUser = db.users.create({
      firstName,
      lastName,
      username,
    }) as unknown as User;
    const token = signJWT(newUser);

    return res(
      ctx.status(StatusCodes.OK),
      ctx.set('Authorization', `Bearer ${token}`),
      ctx.cookie('token', token, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        maxAge: 30 * 24 * 3600, // 30 days
      }),
      ctx.cookie('sessionUser', JSON.stringify(newUser), {
        path: '/',
        sameSite: 'strict',
      }),
      ctx.json(newUser),
    );
  },
);

export default registerHandler;
