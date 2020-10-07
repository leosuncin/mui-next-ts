import { nSQL } from '@nano-sql/core';
import { StatusCodes } from 'http-status-codes';
import {
  validateBody,
  validateMethod,
  withAuthentication,
  withDB,
} from 'libs/middleware';
import { createTodoSchema } from 'libs/validation';
import { NextHttpHandler, Todo } from 'types';

const saveNote: NextHttpHandler = async (req, res) => {
  const [note] = (await nSQL('todos')
    .query('upsert', { ...req.body, createdBy: req.user.id })
    .exec()) as [Todo];

  res.status(StatusCodes.CREATED).json(note);
};

const findNotes: NextHttpHandler = async (req, res) => {
  const limit = Math.abs(parseInt(req.query.limit as string, 10) || 10);
  const page = Math.abs(parseInt(req.query.page as string, 10) || 1);
  const offset = Math.abs(parseInt(req.query.offset as string, 10) || 0);

  const notes = (await nSQL('todos')
    .presetQuery('searchByText', {
      search: req.query.search,
      offset: offset > 0 ? offset : (page - 1) * limit,
      limit,
      createdBy: req.user.id,
    })
    .exec()) as Array<Todo>;

  res.json(notes);
};

export default validateMethod(
  ['GET', 'POST'],
  withDB(
    withAuthentication((req, res) => {
      switch (req.method) {
        case 'GET':
          return findNotes(req, res);

        case 'POST':
          return validateBody(createTodoSchema, saveNote)(req, res);
      }
    }),
  ),
);
