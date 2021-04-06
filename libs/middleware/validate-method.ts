import { MethodNotAllowedError, NextHttpHandler } from 'types';

export function validateMethod(methods: string[]) {
  return (handler: NextHttpHandler): NextHttpHandler => (request, response) => {
    if (methods.includes(request.method)) {
      return handler(request, response);
    }

    response.setHeader('Allow', methods.join(', '));

    throw new MethodNotAllowedError(methods);
  };
}
