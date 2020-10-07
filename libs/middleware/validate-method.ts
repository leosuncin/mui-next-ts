import { StatusCodes } from 'http-status-codes';
import { NextHttpHandler } from 'types';

export function validateMethod(
  methods: string[],
  handler: NextHttpHandler,
): NextHttpHandler {
  return (req, res) => {
    if (!methods.includes(req.method)) {
      res.setHeader('Allow', methods.join(', '));

      return res.status(StatusCodes.METHOD_NOT_ALLOWED).json({
        statusCode: StatusCodes.METHOD_NOT_ALLOWED,
        message: `Allowed method(s): ${methods.join(', ')}`,
      });
    } else return handler(req, res);
  };
}
