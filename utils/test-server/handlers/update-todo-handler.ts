import { StatusCodes } from 'http-status-codes';
import { users } from 'libs/db/users';
import { editTodoSchema as validationSchema } from 'libs/validation/todo';
import { RequestHandler, rest } from 'msw';
import { todoBuild } from 'utils/factories';

const updateTodoHandler: RequestHandler = rest.put(
  '/api/todos/:id',
  (request, res, ctx) => {
    const { id } = request.params;
    try {
      const todo = validationSchema.validateSync(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      return res(
        ctx.json(
          todoBuild({
            map: t => ({
              ...t,
              ...todo,
              id,
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

export default updateTodoHandler;
