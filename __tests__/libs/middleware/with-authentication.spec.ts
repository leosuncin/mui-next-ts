/**
 * @jest-environment node
 */
import { nSQL } from '@nano-sql/core';
import faker from 'faker';
import { sign } from 'jsonwebtoken';
import { dbConfig, users } from 'libs/db';
import { signJWT } from 'libs/jwt';
import { withAuthentication } from 'libs/middleware';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import { UnauthorizedError } from 'types';

const toBase64 = (string: string) => Buffer.from(string).toString('base64');
const toBase64UrlSafe = (string: string) =>
  Buffer.from(string)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

describe('withAuthentication middleware', () => {
  const testCases = [
    null,
    undefined,
    faker.lorem.slug(),
    faker.lorem
      .paragraphs(3)
      .split('\n \r')
      .map(paragraph => toBase64(paragraph))
      .join('.'),
    faker.lorem
      .sentences(3)
      .split('. ')
      .map(sentence => toBase64UrlSafe(sentence))
      .join('.'),
    sign({ sub: faker.random.uuid() }, process.env.APP_SECRET || '5€cr3t'),
    `${toBase64UrlSafe(
      users[0].id,
    )}.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${toBase64UrlSafe(
      users[0].id,
    )}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
    signJWT({ id: faker.random.uuid() } as any),
  ];

  beforeAll(async () => {
    await nSQL().createDatabase(dbConfig);
    await nSQL('users').loadJS(users);
  });

  it.each(
    testCases
      .map(token => (token ? `Bearer ${token}` : undefined))
      .concat(`Basic ${toBase64(users[0].username + ':' + users[0].password)}`),
  )(
    'should fail to authenticate with authorization header: %s',
    async authorization => {
      const handler = jest.fn();
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        headers: {
          authorization,
        },
      });

      await expect(
        withAuthentication(handler)(req as any, res),
      ).rejects.toThrow(UnauthorizedError);

      expect(handler).not.toHaveBeenCalled();
    },
  );

  it.each(testCases)(
    'should fail to authenticate with cookie token: %s',
    async token => {
      const handler = jest.fn();
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        headers: {
          cookie: token
            ? `token=${token}; Path=/; HttpOnly; SameSite=Strict`
            : undefined,
        },
      });

      await expect(
        withAuthentication(handler)(req as any, res),
      ).rejects.toThrow(UnauthorizedError);

      expect(handler).not.toHaveBeenCalled();
    },
  );

  it('should authenticate with cookie token', async () => {
    const token = signJWT(users[0]);
    const handler = jest.fn();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      headers: {
        cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
      },
    });

    await withAuthentication(handler)(req as any, res);

    expect(handler).toHaveBeenCalled();
  });

  it('should authenticate with authorization header', async () => {
    const token = signJWT(users[0]);
    const handler = jest.fn();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    await withAuthentication(handler)(req as any, res);

    expect(handler).toHaveBeenCalled();
  });
});
