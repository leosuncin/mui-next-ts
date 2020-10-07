import { nSQL } from '@nano-sql/core';
import { StatusCodes } from 'http-status-codes';
import {
  validateBody,
  validateMethod,
  withAuthentication,
  withDB,
} from 'libs/middleware';
import { editTodoSchema } from 'libs/validation';
import { Todo } from 'types';

export default validateMethod(
  ['GET', 'PUT', 'DELETE'],
  withDB(
    withAuthentication(async (req, res) => {
      const [todo] = (await nSQL('todos')
        .query('select')
        .where(['id', '=', req.query.id])
        .exec()) as [Todo];

      if (!todo)
        return res.status(StatusCodes.NOT_FOUND).json({
          statusCode: StatusCodes.NOT_FOUND,
          message: `Not found any ToDo with id: ${req.query.id}`,
        });

      if (todo.createdBy !== req.user.id)
        return res.status(StatusCodes.FORBIDDEN).json({
          statusCode: StatusCodes.FORBIDDEN,
          message: "ToDo doesn't belong to you",
        });

      switch (req.method) {
        case 'GET':
          return res.json(todo);

        case 'PUT':
          return validateBody(editTodoSchema, async (req, res) => {
            const [updates] = await nSQL('todos')
              /*
               * Solves issue with @nano-sql/plugin-fuzzy-search,
               * due it needs the id to rebuild the search index
               */
              .query('upsert', {
                ...req.body,
                updatedAt: new Date(),
                id: req.query.id,
              })
              .where(['id', '=', req.query.id])
              .exec();

            res.json(updates);
          })(req, res);

        case 'DELETE':
          await nSQL('todos')
            .query('delete')
            .where(['id', '=', req.query.id])
            .exec();
          return res.status(StatusCodes.NO_CONTENT).send(Buffer.alloc(0));
      }
    }),
  ),
);
