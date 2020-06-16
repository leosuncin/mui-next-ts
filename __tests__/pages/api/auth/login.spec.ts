/**
 * @jest-environment node
 */
import fc from 'fast-check';
import {
  METHOD_NOT_ALLOWED,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import loginHandler from 'pages/api/auth/login';
import { AuthLogin } from 'types';

describe('/api/auth/login', () => {
  it('should validate the request method', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'PUT',
    });

    await loginHandler(req as any, res);

    expect(res._getStatusCode()).toBe(METHOD_NOT_ALLOWED);
    expect(res._getHeaders()).toHaveProperty('allow', 'POST');
  });

  it('should validate the body', () =>
    fc.assert(
      fc.asyncProperty<Partial<AuthLogin>>(
        fc.record(
          {
            username: fc.string(0, 4),
            password: fc.string(0, 7),
          },
          { withDeletedKeys: true },
        ),
        async body => {
          const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'POST',
            body,
          });

          await loginHandler(req as any, res);

          expect(res._getStatusCode()).toBe(UNPROCESSABLE_ENTITY);
          expect(res._getJSONData()).toHaveProperty(
            'errors',
            expect.objectContaining({
              username: expect.stringMatching(/Username.*/),
              password: expect.stringMatching(/Password.*/),
            }),
          );
        },
      ),
    ));

  it('should validate the username', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        username: 'administrator',
        password: 'ji32k7au4a83',
      },
    });

    await loginHandler(req as any, res);

    expect(res._getStatusCode()).toBe(UNAUTHORIZED);
    expect(res._getData()).toHaveProperty(
      'message',
      expect.stringMatching(/Wrong username/),
    );
  });

  it('should validate the password', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        username: 'admin',
        password: 'ji32k7au4a83',
      },
    });

    await loginHandler(req as any, res);

    expect(res._getStatusCode()).toBe(UNAUTHORIZED);
    expect(res._getData()).toHaveProperty(
      'message',
      expect.stringMatching(/Wrong password/),
    );
  });

  it('should validate the correct credentials', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        username: 'admin',
        password: 'Pa$$w0rd!',
      },
    });

    await loginHandler(req as any, res);

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
