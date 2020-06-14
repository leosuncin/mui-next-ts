/**
 * @jest-environment node
 */
import faker from 'faker';
import {
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  NO_CONTENT,
  OK,
  UNPROCESSABLE_ENTITY,
} from 'http-status-codes';
import { todos, users } from 'libs/db';
import { signJWT } from 'libs/jwt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import indexHandler from 'pages/api/todos';
import byIdHandler from 'pages/api/todos/[id]';
import { User } from 'types';

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
      body: {
        text: faker.lorem.sentence(),
      },
    });

    await indexHandler(req, res);

    expect(res._getStatusCode()).toBe(CREATED);
    expect(res._getJSONData()).toHaveProperty('done', false);
  });

  it.each([{}, { text: faker.lorem.paragraphs() }])(
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

      expect(res._getStatusCode()).toBe(UNPROCESSABLE_ENTITY);
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

      expect(res._getStatusCode()).toBe(OK);
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
        search: faker.lorem.word(),
      },
    });

    await indexHandler(req, res);

    expect(res._getStatusCode()).toBe(OK);
    expect(Array.isArray(res._getJSONData())).toBe(true);
  });
});

describe('[GET] /api/todos/:id', () => {
  it('should get one todo', async () => {
    const todo = faker.random.arrayElement(testTodos);
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

    expect(res._getStatusCode()).toBe(OK);
    expect(res._getJSONData()).toBeDefined();
  });

  it('should fail due authorization', async () => {
    const todo = faker.random.arrayElement(
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

    expect(res._getStatusCode()).toBe(FORBIDDEN);
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
        id: faker.random.uuid(),
      },
    });

    await byIdHandler(req, res);

    expect(res._getStatusCode()).toBe(NOT_FOUND);
    expect(res._getJSONData()).toHaveProperty('message');
  });
});

describe('[PUT] /api/todos/:id', () => {
  const todo = faker.random.arrayElement(testTodos);

  test('should update one todo', async () => {
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
        text: faker.hacker.phrase(),
        done: !todo.done,
      },
    });

    await byIdHandler(req, res);

    expect(res._getStatusCode()).toBe(OK);
    expect(res._getJSONData()).toBeDefined();
  });

  it.each([
    { text: faker.lorem.paragraphs(), done: 'a' },
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

    expect(res._getStatusCode()).toBe(UNPROCESSABLE_ENTITY);
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

    expect(res._getStatusCode()).toBe(NO_CONTENT);
  });
});
