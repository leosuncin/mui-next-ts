import { nSQL } from '@nano-sql/core';
import { FuzzyUserSanitize } from '@nano-sql/plugin-fuzzy-search';
import { StatusCodes } from 'http-status-codes';
import {
  catchErrors,
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
  const { search } = req.query as Record<string, string>;

  const notes = (await nSQL('todos')
    .query('select')
    .where(
      search
        ? [
            [`SEARCH(text, "${FuzzyUserSanitize(search)}")`, '=', 0],
            'AND',
            ['createdBy', 'LIKE', req.user.id],
          ]
        : ['createdBy', 'LIKE', req.user.id],
    )
    .orderBy(['createdAt DESC'])
    .limit(limit)
    .offset(offset > 0 ? offset : (page - 1) * limit)
    .exec()) as Array<Todo>;

  res.json(notes);
};

export default catchErrors(
  validateMethod(['GET', 'POST'])(
    withDB(
      withAuthentication((req, res) => {
        switch (req.method) {
          case 'GET':
            return findNotes(req, res);

          case 'POST':
            return validateBody(createTodoSchema)(saveNote)(req, res);
        }
      }),
    ),
  ),
);
