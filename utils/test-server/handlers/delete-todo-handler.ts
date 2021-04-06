import { StatusCodes } from 'http-status-codes';
import { RequestHandler, rest } from 'msw';

const deleteTodoHandler: RequestHandler = rest.delete(
  '/api/todos/:id',
  (_, response, context) =>
    response(context.status(StatusCodes.NO_CONTENT), context.body('')),
);

export default deleteTodoHandler;
