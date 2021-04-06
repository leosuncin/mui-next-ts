import { todos } from 'libs/db/todos';
import { users } from 'libs/db/users';
import { RequestHandler, rest } from 'msw';

const listTodoHandler: RequestHandler = rest.get(
  '/api/todos',
  (request, response, context) => {
    return response(
      context.delay(60),
      context.json(
        todos
          .filter(t => t.createdBy === users[1].id)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      ),
    );
  },
);

export default listTodoHandler;
