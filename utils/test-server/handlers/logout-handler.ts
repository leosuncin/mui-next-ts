import { StatusCodes } from 'http-status-codes';
import { RequestHandler, rest } from 'msw';

const logoutHandler: RequestHandler = rest.delete(
  '/api/auth/logout',
  (req, res, ctx) =>
    res(
      ctx.status(StatusCodes.NO_CONTENT),
      ctx.set('Set-Cookie', 'token=; Max-Age=-1; Path=/; HttpOnly'),
      ctx.set('Set-Cookie', 'sessionUser=; Max-Age=-1; Path=/'),
      ctx.body(''),
    ),
);

export default logoutHandler;
