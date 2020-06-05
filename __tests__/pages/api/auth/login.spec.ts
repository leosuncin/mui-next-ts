import {
  METHOD_NOT_ALLOWED,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import loginHandler from 'pages/api/auth/login';

describe('/api/auth/login', () => {
  it('should validate the request method', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();
    req._setMethod('PUT');

    loginHandler(req as any, res);

    expect(res._getStatusCode()).toBe(METHOD_NOT_ALLOWED);
  });

  it('should validate the body', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();
    req._setMethod('POST');

    loginHandler(req as any, res);

    expect(res._getStatusCode()).toBe(UNPROCESSABLE_ENTITY);
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

    loginHandler(req as any, res);

    expect(res._getStatusCode()).toBe(UNAUTHORIZED);
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

    loginHandler(req as any, res);

    expect(res._getStatusCode()).toBe(UNAUTHORIZED);
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

    loginHandler(req as any, res);

    expect(res._getStatusCode()).toBe(OK);
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
