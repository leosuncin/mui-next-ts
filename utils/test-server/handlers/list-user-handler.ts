import { RequestHandler, rest } from 'msw';
import { userBuild } from 'utils/factories';

const listUserHandler: RequestHandler = rest.get(
  '/api/users',
  (request, response, context) => {
    const limit =
      Number.parseInt(request.url.searchParams.get('limit'), 10) || 10;
    const users = Array.from({ length: limit }, () => userBuild());

    return response(context.delay(60), context.json(users));
  },
);

export default listUserHandler;
