import { StatusCodes } from 'http-status-codes';
import { RequestHandler, rest } from 'msw';

import { db } from '@app/utils/db';

const deleteTodoHandler: RequestHandler = rest.delete(
  '/api/todos/:id',
  (req, res, ctx) => {
    const { id } = req.params;

    db.todo.delete({ where: { id: { equals: id } } });

    return res(ctx.status(StatusCodes.NO_CONTENT), ctx.body(''));
  },
);

export default deleteTodoHandler;
