import { StatusCodes } from 'http-status-codes';
import { signJWT } from 'libs/jwt';
import { loginSchema as validationSchema } from 'libs/validation';
import { RequestHandler, rest } from 'msw';
import { AuthLogin } from 'types';
import type { ValidationError } from 'yup';

const loginHandler: RequestHandler = rest.post(
  '/api/auth/login',
  (request, response, context) => {
    const user = {
      id: '760add88-0a2b-4358-bc3f-7d82245c5dea',
      username: 'admin',
      firstName: 'John',
      lastName: 'Doe',
      picture: 'https://i.pravatar.cc/200',
      bio: 'Lorem ipsum dolorem',
    };
    const { username, password } = request.body as AuthLogin;

    try {
      validationSchema.validateSync(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });
    } catch (error: unknown) {
      return response(
        context.status(StatusCodes.UNPROCESSABLE_ENTITY),
        context.json({
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          message: 'Validation errors',
          errors: (error as ValidationError).inner.reduce(
            (previous, error) => ({
              ...previous,
              [error.path]: error.errors[0],
            }),
            {},
          ),
        }),
      );
    }

    if (username === user.username && password === 'Pa$$w0rd!') {
      const token = signJWT(user as any);
      return response(
        context.status(StatusCodes.OK),
        context.set('Authorization', `Bearer ${token}`),
        context.cookie('token', token, {
          httpOnly: true,
          path: '/',
          sameSite: 'strict',
          maxAge: 30 * 24 * 3600, // 30 days
        }),
        context.cookie('sessionUser', JSON.stringify(user), {
          path: '/',
          sameSite: 'strict',
        }),
        context.json(user),
      );
    }

    if (username === user.username)
      return response(
        context.status(StatusCodes.UNAUTHORIZED),
        context.json({
          statusCode: StatusCodes.UNAUTHORIZED,
          message: `Wrong password for user: ${username}`,
        }),
      );

    return response(
      context.status(StatusCodes.UNAUTHORIZED),
      context.json({
        statusCode: StatusCodes.UNAUTHORIZED,
        message: `Wrong username: ${username}`,
      }),
    );
  },
);

export default loginHandler;
