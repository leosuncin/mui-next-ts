import { StatusCodes } from 'http-status-codes';
import { signJWT } from 'libs/jwt';
import { loginSchema as validationSchema } from 'libs/validation';
import { RequestHandler, rest } from 'msw';
import type { AuthLogin, User } from 'types';
import { db } from 'utils/db';

const loginHandler: RequestHandler = rest.post(
  '/api/auth/login',
  (req, res, ctx) => {
    const { username, password } = req.body as AuthLogin;
    const user = db.users.findFirst({
      where: { username: { equals: username } },
    }) as User;

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

    if (user && password === 'Pa$$w0rd!') {
      const token = signJWT(user);
      return res(
        ctx.status(StatusCodes.OK),
        ctx.set('Authorization', `Bearer ${token}`),
        ctx.cookie('token', token, {
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          maxAge: 30 * 24 * 3600, // 30 days
        }),
        ctx.cookie('sessionUser', JSON.stringify(user), {
          path: '/',
          sameSite: 'strict',
        }),
        ctx.json(user),
      );
    }

    if (!user)
      return res(
        ctx.status(StatusCodes.UNAUTHORIZED),
        ctx.json({
          statusCode: StatusCodes.UNAUTHORIZED,
          message: `Wrong username: ${username}`,
        }),
      );

    return res(
      ctx.status(StatusCodes.UNAUTHORIZED),
      ctx.json({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: `Wrong password for user: ${username}`,
      }),
    );
  },
);

export default loginHandler;
