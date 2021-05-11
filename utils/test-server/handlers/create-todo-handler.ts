import { StatusCodes } from 'http-status-codes';
import { createTodoSchema as validationSchema } from 'libs/validation/todo';
import { RequestHandler, rest } from 'msw';
import { db } from 'utils/db';

const createTodoHandler: RequestHandler = rest.post(
  '/api/todos',
  (req, res, ctx) => {
    try {
      const newTodo = validationSchema.validateSync(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      const todo = db.todo.create({
        ...newTodo,
        done: false,
        createdBy: db.users.findFirst({ where: {} }),
      });
      // @ts-expect-error createdBy refers to user.id
      todo.createdBy = todo.createdBy.id;

      return res(
        ctx.delay(30),
        ctx.status(StatusCodes.CREATED),
        ctx.json(todo),
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

export default createTodoHandler;
