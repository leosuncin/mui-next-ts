import { MethodNotAllowedError, NextHttpHandler } from 'types';

export function validateMethod(
  methods: string[],
  handler: NextHttpHandler,
): NextHttpHandler {
  return (req, res) => {
    if (!methods.includes(req.method)) {
      res.setHeader('Allow', methods.join(', '));

      throw new MethodNotAllowedError(methods);
    } else return handler(req, res);
  };
}
