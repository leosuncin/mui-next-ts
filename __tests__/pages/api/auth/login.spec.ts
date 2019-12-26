import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';

import loginApi from 'pages/api/auth/login';

describe('POST /api/auth/login', () => {
  it('should validate the request method', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();
    req._setMethod('PUT');

    loginApi(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('should validate the body', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();
    req._setMethod('POST');

    loginApi(req, res);

    expect(res._getStatusCode()).toBe(422);
    expect(Array.isArray(res._getData().message)).toBe(true);
  });

  it('should validate the username', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        username: 'administrator',
        password: 'ji32k7au4a83',
      },
    });

    loginApi(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getData().message).toMatch(/username/);
  });

  it('should validate the password', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        username: 'admin',
        password: 'ji32k7au4a83',
      },
    });

    loginApi(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getData().message).toMatch(/Wrong\s+password/);
  });

  it('should validate the correct credentials', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        username: 'admin',
        password: 'Pa$$w0rd!',
      },
    });

    loginApi(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getHeaders()).toHaveProperty(
      'authorization',
      expect.stringMatching(/Bearer \w+/),
    );
    expect(res._getHeaders()).toHaveProperty(
      'set-cookie',
      expect.stringMatching(/token=s%3.+; Path=\/; HttpOnly/),
    );
    expect(res._getData()).toBeDefined();
  });
});
