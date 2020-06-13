/**
 * @jest-environment node
 */
import faker from 'faker';
import {
  CONFLICT,
  METHOD_NOT_ALLOWED,
  OK,
  UNPROCESSABLE_ENTITY,
} from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import registerHandler from 'pages/api/auth/register';

describe('/api/auth/register', () => {
  it('should validate the request method', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
    });

    await registerHandler(req as any, res);

    expect(res._getStatusCode()).toBe(METHOD_NOT_ALLOWED);
    expect(res._getHeaders()).toHaveProperty('allow', 'POST');
  });

  it('should validate the body', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {},
    });

    await registerHandler(req as any, res);

    expect(res._getStatusCode()).toBe(UNPROCESSABLE_ENTITY);
    expect(res._getJSONData()).toHaveProperty(
      'errors',
      expect.objectContaining({
        firstName: 'First name is a required field',
        lastName: 'Last name is a required field',
        password: 'Password is a required field',
        username: 'Username is a required field',
      }),
    );
  });

  it('should reject duplicate user', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        firstName: 'Jane',
        lastName: 'Doe',
        username: 'jane_doe',
        password: 'ji32k7au4a83',
      },
    });

    await registerHandler(req as any, res);

    expect(res._getStatusCode()).toBe(CONFLICT);
    expect(res._getData().message).toMatch(/already registered/);
  });

  it('should register a new user', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        username: faker.internet.email(),
        password: faker.internet.password(),
      },
    });

    await registerHandler(req as any, res);

    expect(res._getStatusCode()).toBe(OK);
    expect(res._getHeaders()).toHaveProperty(
      'authorization',
      expect.stringMatching(/Bearer \w+/),
    );
    expect(res._getHeaders()).toHaveProperty(
      'set-cookie',
      expect.arrayContaining([
        expect.stringMatching(/token=.+; Path=\/; HttpOnly; SameSite=Strict/),
      ]),
    );
    expect(res._getJSONData()).toBeDefined();
    expect(res._getJSONData()).not.toHaveProperty('password');
  });
});
