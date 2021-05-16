import { RequestHandler, rest } from 'msw';
import { todos } from 'src/libs/db/todos';
import { users } from 'src/libs/db/users';

const listTodoHandler: RequestHandler = rest.get(
  '/api/todos',
  (req, res, ctx) => {
    return res(
      ctx.delay(60),
      ctx.json(
        todos
          .filter(t => t.createdBy === users[1].id)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      ),
    );
  },
);

export default listTodoHandler;
