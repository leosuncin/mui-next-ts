import { StatusCodes } from 'http-status-codes';
import { signJWT } from 'libs/jwt';
import { registerSchema as validationSchema } from 'libs/validation';
import { RequestHandler, rest } from 'msw';
import type { AuthRegister } from 'types';
import { db } from 'utils/db';

const registerHandler: RequestHandler = rest.post(
  '/api/auth/register',
  (req, res, ctx) => {
    const { firstName, lastName, username } = req.body as AuthRegister;
    const user = db.users.findFirst({
      where: { username: { equals: username } },
    });

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
    });
    const token = signJWT(newUser as any);

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
