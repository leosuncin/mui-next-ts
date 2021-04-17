import { StatusCodes } from 'http-status-codes';
import { users } from 'libs/db/users';
import { createTodoSchema as validationSchema } from 'libs/validation/todo';
import { RequestHandler, rest } from 'msw';
import { todoBuild } from 'utils/factories';

const createTodoHandler: RequestHandler = rest.post(
  '/api/todos',
  (request, res, ctx) => {
    try {
      const newTodo = validationSchema.validateSync(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      return res(
        ctx.delay(30),
        ctx.status(StatusCodes.CREATED),
        ctx.json(
          todoBuild({
            map: todo => ({
              ...todo,
              ...newTodo,
              done: false,
              createdBy: users[0].id as string,
            }),
          }),
        ),
      );
    } catch (error) {
      return res(
        ctx.status(StatusCodes.UNPROCESSABLE_ENTITY),
        ctx.json({
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          message: 'Validation errors',
          errors: error.inner.reduce(
            (previous, error) => ({
              ...previous,
              [error.path]: error.errors[0],
            }),
            {},
          ),
        }),
      );
    }
  },
);

export default createTodoHandler;
