import { nSQL } from '@nano-sql/core';
import { StatusCodes } from 'http-status-codes';
import {
  catchErrors,
  validateBody,
  validateMethod,
  withAuthentication,
  withDB,
} from 'libs/middleware';
import { editTodoSchema } from 'libs/validation';
import { ForbiddenError, NextHttpHandler, NotFoundError, Todo } from 'types';

const putHandler: NextHttpHandler = async (request, res) => {
  const [updates] = await nSQL('todos')
    /*
     * Solves issue with @nano-sql/plugin-fuzzy-search,
     * due it needs the id to rebuild the search index
     */
    .query('upsert', {
      ...request.body,
      updatedAt: new Date(),
      id: request.query.id,
    })
    .where(['id', '=', request.query.id])
    .exec();

  res.json({
    ...updates,
    /* `updates.updatedAt` is returned as string,
     * but to return a ISO 8601 first cast to date
     */
    updatedAt: new Date(updates.updatedAt),
  });
};

const deleteHandler: NextHttpHandler = async (request, res) => {
  await nSQL('todos')
    .query('delete')
    .where(['id', '=', request.query.id])
    .exec();
  res.status(StatusCodes.NO_CONTENT).send(Buffer.alloc(0));
};

const endpointHandler: NextHttpHandler = async (request, res) => {
  const [todo] = (await nSQL('todos')
    .query('select')
    .where(['id', '=', request.query.id])
    .exec()) as [Todo];

  if (!todo)
    throw new NotFoundError(`Not found any ToDo with id: ${request.query.id}`);

  if (todo.createdBy !== request.user.id)
    throw new ForbiddenError("ToDo doesn't belong to you");

  switch (request.method) {
    case 'GET': {
      res.json(todo);
      return;
    }

    case 'PUT':
      return validateBody(editTodoSchema)(putHandler)(request, res);

    case 'DELETE':
      return deleteHandler(request, res);
  }
};

export default catchErrors(
  validateMethod(['GET', 'PUT', 'DELETE'])(
    withDB(withAuthentication(endpointHandler)),
  ),
);
