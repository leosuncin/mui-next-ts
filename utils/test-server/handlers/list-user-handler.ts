import { RequestHandler, rest } from 'msw';
import { userBuild } from 'utils/factories';

const listUserHandler: RequestHandler = rest.get(
  '/api/users',
  (request, res, ctx) => {
    const limit =
      Number.parseInt(request.url.searchParams.get('limit'), 10) || 10;
    const users = Array.from({ length: limit }, () => userBuild());

    return res(ctx.delay(60), ctx.json(users));
  },
);

export default listUserHandler;
