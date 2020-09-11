import { CREATED, UNPROCESSABLE_ENTITY } from 'http-status-codes';
import { users } from 'libs/db/users';
import { createTodoSchema as validationSchema } from 'libs/validation/todo';
import { RequestHandler, rest } from 'msw';
import { todoBuild } from 'utils/factories';

const createTodoHandler: RequestHandler = rest.post(
  '/api/todos',
  (req, res, ctx) => {
    try {
      const newTodo = validationSchema.validateSync(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      return res(
        ctx.delay(30),
        ctx.status(CREATED),
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
        ctx.status(UNPROCESSABLE_ENTITY),
        ctx.json({
          statusCode: UNPROCESSABLE_ENTITY,
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

export default createTodoHandler;
