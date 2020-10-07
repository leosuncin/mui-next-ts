import { StatusCodes } from 'http-status-codes';
import { RequestHandler, rest } from 'msw';

const deleteTodoHandler: RequestHandler = rest.delete(
  '/api/todos/:id',
  (req, res, ctx) => res(ctx.status(StatusCodes.NO_CONTENT), ctx.body('')),
);

export default deleteTodoHandler;
