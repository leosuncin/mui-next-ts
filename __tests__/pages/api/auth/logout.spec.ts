import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import logoutHandler from 'pages/api/auth/logout';
import { User } from 'types';

describe('[DELETE] /api/auth/logout', () => {
  it('should close the session', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const sessionUser =
      '%7B%22sub%22%3A%20%221234567890%22%2C%22name%22%3A%20%22John%20Doe%22%2C%22iat%22%3A%201516239022%7D';
    const { req, res } = createMocks<
      NextApiRequest & { user: User },
      NextApiResponse
    >({
      method: 'DELETE',
      headers: {
        cookie: `token=${token}; sessionUser=${sessionUser}`,
        authorization: `Bearer ${token}`,
      },
      url: '/api/auth/logout',
    });

    logoutHandler(req, res);

    expect(res._getStatusCode()).toBe(StatusCodes.NO_CONTENT);
    expect(res._getHeaders()).toMatchInlineSnapshot(`
      Object {
        "set-cookie": Array [
          "token=; Max-Age=-1; Path=/; HttpOnly",
          "sessionUser=; Max-Age=-1; Path=/",
        ],
      }
    `);
  });
});
