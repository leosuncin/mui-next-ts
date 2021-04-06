import { StatusCodes } from 'http-status-codes';
import { RequestHandler, rest } from 'msw';

const logoutHandler: RequestHandler = rest.delete(
  '/api/auth/logout',
  (request, response, context) =>
    response(
      context.status(StatusCodes.NO_CONTENT),
      context.set('Set-Cookie', 'token=; Max-Age=-1; Path=/; HttpOnly'),
      context.set('Set-Cookie', 'sessionUser=; Max-Age=-1; Path=/'),
      context.body(''),
    ),
);

export default logoutHandler;
