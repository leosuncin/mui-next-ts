import { StatusCodes } from 'http-status-codes';
import { users } from 'libs/db/users';
import { createTodoSchema as validationSchema } from 'libs/validation/todo';
import { RequestHandler, rest } from 'msw';
import { todoBuild } from 'utils/factories';
import type { ValidationError } from 'yup';

const createTodoHandler: RequestHandler = rest.post(
  '/api/todos',
  (request, response, context) => {
    try {
      const newTodo = validationSchema.validateSync(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      return response(
        context.delay(30),
        context.status(StatusCodes.CREATED),
        context.json(
          todoBuild({
            map: todo => ({
              ...todo,
              ...newTodo,
              done: false,
              createdBy: users[0].id,
            }),
          }),
        ),
      );
    } catch (error: unknown) {
      return response(
        context.status(StatusCodes.UNPROCESSABLE_ENTITY),
        context.json({
          statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
          message: 'Validation errors',
          errors: (error as ValidationError).inner.reduce(
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
