import { StatusCodes } from 'http-status-codes';
import { users } from 'libs/db/users';
import { editTodoSchema as validationSchema } from 'libs/validation/todo';
import { RequestHandler, rest } from 'msw';
import { todoBuild } from 'utils/factories';
import type { ValidationError } from 'yup';

const updateTodoHandler: RequestHandler = rest.put(
  '/api/todos/:id',
  (request, response, context) => {
    const { id } = request.params;
    try {
      const todo = validationSchema.validateSync(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      return response(
        context.json(
          todoBuild({
            map: t => ({
              ...t,
              ...todo,
              id,
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

export default updateTodoHandler;
