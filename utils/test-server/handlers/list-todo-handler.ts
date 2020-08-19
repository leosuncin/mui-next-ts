import { users } from 'libs/db/users';
import { RequestHandler, rest } from 'msw';
import { todoBuild } from 'utils/factories';

const listTodoHandler: RequestHandler = rest.get(
  '/api/todos',
  (req, res, ctx) => {
    const limit = parseInt(req.url.searchParams.get('limit'), 10) || 10;
    const todos = Array.from({ length: limit }, () =>
      todoBuild({
        traits: 'old',
        overrides: { createdBy: users[0].id as string },
      }),
    );

    return res(ctx.delay(60), ctx.json(todos));
  },
);

export default listTodoHandler;
