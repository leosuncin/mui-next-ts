/**
 * @jest-environment node
 */
import fc from 'fast-check';
import { StatusCodes } from 'http-status-codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import registerHandler from 'src/pages/api/auth/register';
import type { AuthRegister, User } from 'src/types';
import { registerBuild } from 'src/utils/factories';

describe('/api/auth/register', () => {
  it('should validate the request method', async () => {
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'PUT',
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.METHOD_NOT_ALLOWED);
    expect(res._getHeaders()).toHaveProperty('allow', 'POST');
  });

  it('should validate the body', () =>
    fc.assert(
      fc.asyncProperty<Partial<AuthRegister>>(
        fc.record(
          {
            firstName: fc.unicodeString({ minLength: 0, maxLength: 1 }),
            lastName: fc.unicodeString({ minLength: 0, maxLength: 1 }),
            username: fc.string({ minLength: 0, maxLength: 4 }),
            password: fc.string({ minLength: 0, maxLength: 7 }),
          },
          { withDeletedKeys: true },
        ),
        async body => {
          const { req, res } = createMocks<
            NextApiRequest & { user: User },
            NextApiResponse
          >({
            method: 'POST',
            body,
          });

          await registerHandler(req, res);

          expect(res._getStatusCode()).toBe(StatusCodes.UNPROCESSABLE_ENTITY);
          expect(res._getJSONData()).toHaveProperty(
            'errors',
            expect.objectContaining({
              firstName: expect.stringMatching(/First name.*/),
              lastName: expect.stringMatching(/Last name.*/),
              username: expect.stringMatching(/Username.*/),
              password: expect.stringMatching(/Password.*/),
            }),
          );
        },
      ),
    ));

  it('should reject duplicate user', async () => {
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'POST',
      body: {
        firstName: 'Jane',
        lastName: 'Doe',
        username: 'jane_doe',
        password: 'ji32k7au4a83',
      },
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.CONFLICT);
    expect(res._getJSONData().message).toMatch(/already registered/);
  });

  it('should register a new user', async () => {
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'POST',
      body: registerBuild(),
    });

    await registerHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.OK);
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
