import { METHOD_NOT_ALLOWED } from 'http-status-codes';

import { NextHttpHandler } from './with-db';

export function validateMethod(
  methods: string[],
  handler: NextHttpHandler,
): NextHttpHandler {
  return (req, res) => {
    if (!methods.includes(req.method)) {
      res.setHeader('Allow', methods.join(', '));

      return res.status(METHOD_NOT_ALLOWED).json({
        statusCode: METHOD_NOT_ALLOWED,
        message: `Allowed method(s): ${methods.join(', ')}`,
      });
    } else return handler(req, res);
  };
}
