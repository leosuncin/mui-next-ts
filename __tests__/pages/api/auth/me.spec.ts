/**
 * @jest-environment node
 */
import { OK } from 'http-status-codes';
import { users } from 'libs/db/users';
import { signJWT } from 'libs/jwt';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import authMeHandler from 'pages/api/auth/me';
import { User } from 'types';

describe('[GET] /api/auth/me', () => {
  test('should get current session user', async () => {
    const token = signJWT(users[0]);
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'GET',
      headers: {
        cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
        authorization: `Bearer ${token}`,
      },
      url: '/api/auth/me',
    });

    await authMeHandler(req, res);

    expect(res._getStatusCode()).toBe(OK);
    expect(res._getJSONData()).toHaveProperty('id', users[0].id);
  });
});
