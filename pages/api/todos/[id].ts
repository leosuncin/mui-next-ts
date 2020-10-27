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

const putHandler: NextHttpHandler = async (req, res) => {
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
};

const deleteHandler: NextHttpHandler = async (req, res) => {
  await nSQL('todos').query('delete').where(['id', '=', req.query.id]).exec();
  res.status(StatusCodes.NO_CONTENT).send(Buffer.alloc(0));
};

const endpointHandler: NextHttpHandler = async (req, res) => {
  const [todo] = (await nSQL('todos')
    .query('select')
    .where(['id', '=', req.query.id])
    .exec()) as [Todo];

  if (!todo)
    throw new NotFoundError(`Not found any ToDo with id: ${req.query.id}`);

  if (todo.createdBy !== req.user.id)
    throw new ForbiddenError("ToDo doesn't belong to you");

  switch (req.method) {
    case 'GET':
      return res.json(todo);

    case 'PUT':
      return validateBody(editTodoSchema)(putHandler)(req, res);

    case 'DELETE':
      return deleteHandler(req, res);
  }
};

export default catchErrors(
  validateMethod(['GET', 'PUT', 'DELETE'])(
    withDB(withAuthentication(endpointHandler)),
  ),
);
