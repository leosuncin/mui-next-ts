import { SERVICE_UNAVAILABLE } from 'http-status-codes';
import { RequestHandler, rest } from 'msw';

export const respondWithServiceUnavailable = (
  endpoint: string,
  method: keyof typeof rest,
): RequestHandler =>
  rest[method](endpoint, (req, res, ctx) => {
    return res(
      ctx.status(SERVICE_UNAVAILABLE),
      ctx.json({
        statusCode: SERVICE_UNAVAILABLE,
        message: 'Database connection error',
      }),
    );
  });
