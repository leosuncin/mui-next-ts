import { MethodNotAllowedError, NextHttpHandler } from 'types';

export function validateMethod(methods: string[]) {
  return (handler: NextHttpHandler): NextHttpHandler => (request, res) => {
    if (!methods.includes(request.method)) {
      res.setHeader('Allow', methods.join(', '));

      throw new MethodNotAllowedError(methods);
    } else return handler(request, res);
  };
}
