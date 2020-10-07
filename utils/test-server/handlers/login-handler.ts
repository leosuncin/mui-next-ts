import { StatusCodes } from 'http-status-codes';
import { signJWT } from 'libs/jwt';
import { loginSchema as validationSchema } from 'libs/validation';
import { RequestHandler, rest } from 'msw';
import { AuthLogin } from 'types';

const loginHandler: RequestHandler = rest.post(
  '/api/auth/login',
  (req, res, ctx) => {
    const user = {
      id: '760add88-0a2b-4358-bc3f-7d82245c5dea',
      username: 'admin',
      firstName: 'John',
      lastName: 'Doe',
      picture: 'https://i.pravatar.cc/200',
      bio: 'Lorem ipsum dolorem',
    };
    const { username, password } = req.body as AuthLogin;

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

    if (username === user.username && password === 'Pa$$w0rd!') {
      const token = signJWT(user as any);
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

    if (username === user.username)
      return res(
        ctx.status(StatusCodes.UNAUTHORIZED),
        ctx.json({
          statusCode: StatusCodes.UNAUTHORIZED,
          message: `Wrong password for user: ${username}`,
        }),
      );

    return res(
      ctx.status(StatusCodes.UNAUTHORIZED),
      ctx.json({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: `Wrong username: ${username}`,
      }),
    );
  },
);

export default loginHandler;
