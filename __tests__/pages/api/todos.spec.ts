/**
 * @jest-environment node
 */
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import { todos } from 'src/libs/db/todos';
import { users } from 'src/libs/db/users';
import { signJWT } from 'src/libs/jwt';
import indexHandler from 'src/pages/api/todos';
import byIdHandler from 'src/pages/api/todos/[id]';
import { User } from 'src/types';
import {
  createTodoBuild,
  randomArrayElement,
  todoBuild,
} from 'src/utils/factories';

const testUser = users[1];
const testTodos = todos.filter(todo => todo.createdBy === testUser.id);
const token = signJWT(testUser);

describe('[POST] /api/todos', () => {
  it('should create a new todo', async () => {
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'POST',
      headers: {
        cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
        authorization: `Bearer ${token}`,
      },
      body: createTodoBuild(),
    });

    await indexHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.CREATED);
    expect(res._getJSONData()).toHaveProperty('done', false);
  });

  it.each([{}, createTodoBuild({ traits: 'invalid' })])(
    'should fail with body: %j',
    async body => {
      const { req, res } = createMocks<
        NextApiRequest & { user: User },
        NextApiResponse
      >({
        method: 'POST',
        headers: {
          cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
          authorization: `Bearer ${token}`,
        },
        body,
      });

      await indexHandler(req, res);

      expect(res._getStatusCode()).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(res._getJSONData()).toHaveProperty(
        'errors',
        expect.objectContaining({
          text: expect.stringMatching(/Text.*/),
        }),
      );
    },
  );
});

describe('[GET] /api/todos', () => {
  it.each([
    [null, null, null],
    [undefined, undefined, undefined],
    [NaN, NaN, NaN],
    [0, 0, 0],
    ['', 'a', 'b'],
    ['10', '1', '0'],
    ['10', '1', '2'],
  ])(
    'should list the todos with limit=%s, page=%s & offset=%s',
    async (limit, page, offset) => {
      const { req, res } = createMocks<
        NextApiRequest & { user: User },
        NextApiResponse
      >({
        method: 'GET',
        headers: {
          cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
          authorization: `Bearer ${token}`,
        },
        query: {
          limit,
          page,
          offset,
        },
      });

      await indexHandler(req, res);

      expect(res._getStatusCode()).toBe(StatusCodes.OK);
      expect(Array.isArray(res._getJSONData())).toBe(true);
      expect(res._getJSONData().length).toBeLessThanOrEqual(10);
    },
  );

  it('should search by text', async () => {
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'GET',
      headers: {
        cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
        authorization: `Bearer ${token}`,
      },
      query: {
        search: createTodoBuild({ traits: 'search' }).text,
      },
    });

    await indexHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.OK);
    expect(Array.isArray(res._getJSONData())).toBe(true);
  });
});

describe('[GET] /api/todos/:id', () => {
  it('should get one todo', async () => {
    const todo = randomArrayElement(testTodos);
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'GET',
      headers: {
        cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
        authorization: `Bearer ${token}`,
      },
      query: {
        id: todo.id,
      },
    });

    await byIdHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toBeDefined();
  });

  it('should fail due authorization', async () => {
    const todo = randomArrayElement(
      todos.filter(t => t.createdBy !== testUser.id),
    );
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'GET',
      headers: {
        cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
        authorization: `Bearer ${token}`,
      },
      query: {
        id: todo.id,
      },
    });

    await byIdHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.FORBIDDEN);
    expect(res._getJSONData()).toHaveProperty('message');
  });

  it('should fail when not exist', async () => {
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'GET',
      headers: {
        cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
        authorization: `Bearer ${token}`,
      },
      query: {
        id: todoBuild().id,
      },
    });

    await byIdHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.NOT_FOUND);
    expect(res._getJSONData()).toHaveProperty('message');
  });
});

describe('[PUT] /api/todos/:id', () => {
  const todo = randomArrayElement(testTodos);

  it('should update one todo', async () => {
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'PUT',
      headers: {
        cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
        authorization: `Bearer ${token}`,
      },
      query: {
        id: todo.id,
      },
      body: {
        ...createTodoBuild(),
        done: !todo.done,
      },
    });

    await byIdHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toBeDefined();
  });

  it.each([
    { ...createTodoBuild({ traits: 'invalid' }), done: 'a' },
    { text: null, done: 42 },
    { text: null, done: null },
  ])('should fail with body: %j', async body => {
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'PUT',
      headers: {
        cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
        authorization: `Bearer ${token}`,
      },
      query: {
        id: todo.id,
      },
      body,
    });

    await byIdHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res._getJSONData()).toHaveProperty(
      'errors',
      expect.objectContaining({
        text: expect.stringMatching(/Text.*/),
        done: expect.stringMatching(/Done.*/),
      }),
    );
  });
});

describe('[DELETE] /api/todos/:id', () => {
  it('should remove one todo', async () => {
    const todo = testTodos.shift();
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'DELETE',
      headers: {
        cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
        authorization: `Bearer ${token}`,
      },
      query: {
        id: todo.id,
      },
    });

    await byIdHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.NO_CONTENT);
  });
});
