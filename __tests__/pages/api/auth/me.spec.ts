/**
 * @jest-environment node
 */
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';

import { users } from '@app/libs/db/users';
import { signJWT } from '@app/libs/jwt';
import authMeHandler from '@app/pages/api/auth/me';
import { User } from '@app/types';

describe('[GET] /api/auth/me', () => {
  it('should get current session user', async () => {
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

    expect(res._getStatusCode()).toBe(StatusCodes.OK);
    expect(res._getJSONData()).toHaveProperty('id', users[0].id);
  });
});
