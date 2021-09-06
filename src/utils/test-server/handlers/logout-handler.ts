import { StatusCodes } from 'http-status-codes';
import { RequestHandler, rest } from 'msw';

const logoutHandler: RequestHandler = rest.delete(
  '/api/auth/logout',
  (req, res, ctx) =>
    res(
      ctx.status(StatusCodes.NO_CONTENT),
      ctx.cookie('token', '', {
        httpOnly: true,
        maxAge: -1,
        sameSite: 'strict',
      }),
      ctx.cookie('sessionUser', '', { maxAge: -1, sameSite: 'strict' }),
      ctx.body(''),
    ),
);

export default logoutHandler;
