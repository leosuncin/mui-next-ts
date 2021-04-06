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

const saveNote: NextHttpHandler = async (request, response) => {
  const [note] = (await nSQL('todos')
    .query('upsert', { ...request.body, createdBy: request.user.id })
    .exec()) as [Todo];

  response.status(StatusCodes.CREATED).json(note);
};

const findNotes: NextHttpHandler = async (request, response) => {
  const limit = Math.abs(
    Number.parseInt(request.query.limit as string, 10) || 10,
  );
  const page = Math.abs(Number.parseInt(request.query.page as string, 10) || 1);
  const offset = Math.abs(
    Number.parseInt(request.query.offset as string, 10) || 0,
  );
  const { search } = request.query as Record<string, string>;

  const notes = (await nSQL('todos')
    .query('select')
    .where(
      search
        ? [
            [`SEARCH(text, "${FuzzyUserSanitize(search)}")`, '=', 0],
            'AND',
            ['createdBy', 'LIKE', request.user.id],
          ]
        : ['createdBy', 'LIKE', request.user.id],
    )
    .orderBy(['createdAt DESC'])
    .limit(limit)
    .offset(offset > 0 ? offset : (page - 1) * limit)
    .exec()) as Todo[];

  response.json(notes);
};

export default catchErrors(
  validateMethod(['GET', 'POST'])(
    withDB(
      withAuthentication((request, response) => {
        switch (request.method) {
          case 'GET':
            return findNotes(request, response);

          case 'POST':
            return validateBody(createTodoSchema)(saveNote)(request, response);
        }
      }),
    ),
  ),
);
