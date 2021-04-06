import faker from 'faker';
import { StatusCodes } from 'http-status-codes';
import { signJWT } from 'libs/jwt';
import { registerSchema as validationSchema } from 'libs/validation';
import { RequestHandler, rest } from 'msw';
import { AuthRegister } from 'types';
import type { ValidationError } from 'yup';

const registerHandler: RequestHandler = rest.post(
  '/api/auth/register',
  (request, response, context) => {
    const user = {
      id: 'ee60d495-e47e-4df2-87dd-db964a8e833b',
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'jane_doe',
      picture: 'https://i.pravatar.cc/200',
      bio:
        'She had this enormous capacity for wonder, and lived by the Golden Rule.',
    };
    const { firstName, lastName, username } = request.body as AuthRegister;

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

    if (username === user.username) {
      return response(
        context.status(StatusCodes.CONFLICT),
        context.json({
          statusCode: StatusCodes.CONFLICT,
          message: 'Username or Email already registered',
        }),
      );
    }

    const newUser = {
      id: faker.random.uuid(),
      firstName,
      lastName,
      username,
      picture: faker.image.avatar(),
      bio: faker.lorem.paragraph(),
    };
    const token = signJWT(newUser as any);

    return response(
      context.status(StatusCodes.OK),
      context.set('Authorization', `Bearer ${token}`),
      context.cookie('token', token, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
        maxAge: 30 * 24 * 3600, // 30 days
      }),
      context.cookie('sessionUser', JSON.stringify(newUser), {
        path: '/',
        sameSite: 'strict',
      }),
      context.json(newUser),
    );
  },
);

export default registerHandler;
