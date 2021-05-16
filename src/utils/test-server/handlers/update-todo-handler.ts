import { StatusCodes } from 'http-status-codes';
import { RequestHandler, rest } from 'msw';
import { users } from 'src/libs/db/users';
import { editTodoSchema as validationSchema } from 'src/libs/validation/todo';
import { todoBuild } from 'src/utils/factories';

const updateTodoHandler: RequestHandler = rest.put(
  '/api/todos/:id',
  (req, res, ctx) => {
    const { id } = req.params;
    try {
      const todo = validationSchema.validateSync(req.body, {
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
            (prev, error) => ({ ...prev, [error.path]: error.errors[0] }),
            {},
          ),
        }),
      );
    }
  },
);

export default updateTodoHandler;
