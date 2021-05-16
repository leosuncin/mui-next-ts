import { StatusCodes } from 'http-status-codes';
import { RequestHandler, rest } from 'msw';

export const respondWithServiceUnavailable = (
  endpoint: string,
  method: keyof typeof rest,
): RequestHandler =>
  rest[method](endpoint, (req, res, ctx) => {
    return res(
      ctx.status(StatusCodes.SERVICE_UNAVAILABLE),
      ctx.json({
        statusCode: StatusCodes.SERVICE_UNAVAILABLE,
        message: 'Database connection error',
      }),
    );
  });

export const respondWithInternalServerError = (
  endpoint: string,
  method: keyof typeof rest,
): RequestHandler =>
  rest[method](endpoint, (req, res, ctx) => {
    return res(ctx.status(StatusCodes.INTERNAL_SERVER_ERROR));
  });
