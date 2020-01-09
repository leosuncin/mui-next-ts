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
  it('should validate the request method', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();
    req._setMethod('PUT');

    registerHandler(req as any, res);

    expect(res._getStatusCode()).toBe(METHOD_NOT_ALLOWED);
  });

  it('should validate the body', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();
    req._setMethod('POST');

    registerHandler(req as any, res);

    expect(res._getStatusCode()).toBe(UNPROCESSABLE_ENTITY);
    expect(Array.isArray(res._getData().message)).toBe(true);
  });

  it('should reject duplicate user', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();
    req._setMethod('POST');
    req._setBody({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: 'jane@doe.me',
      password: 'ji32k7au4a83',
    });

    registerHandler(req as any, res);

    expect(res._getStatusCode()).toBe(CONFLICT);
    expect(res._getData().message).toMatch(/already registered/);
  });

  it('should register a new user', () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>();
    req._setMethod('POST');
    req._setBody({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    registerHandler(req as any, res);

    expect(res._getStatusCode()).toBe(OK);
    expect(res._getData()).toBeDefined();
  });
});
