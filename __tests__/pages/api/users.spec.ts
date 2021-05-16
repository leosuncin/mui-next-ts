/**
 * @jest-environment node
 */
import { StatusCodes } from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';

import { users } from '@app/libs/db/users';
import { signJWT } from '@app/libs/jwt';
import indexHandler from '@app/pages/api/users';
import { User } from '@app/types';

const testUser = users[1];
const token = signJWT(testUser);

describe('[GET] /api/users', () => {
  it.each([
    [null, null, null],
    [undefined, undefined, undefined],
    [NaN, NaN, NaN],
    [0, 0, 0],
    ['', 'a', 'b'],
    ['10', '1', '0'],
    ['10', '1', '2'],
  ])(
    'should list the users with limit=%s, page=%s & offset=%s',
    async (limit, page, offset) => {
      const { req, res } = createMocks<
        NextApiRequest & { user: User },
        NextApiResponse
      >({
        method: 'GET',
        headers: {
          cookie: `token=${token}; Path=/; HttpOnly; SameSite=Strict`,
          authorization: `Bearer ${token}`,
        },
        query: {
          limit,
          page,
          offset,
        },
      });

      await indexHandler(req, res);

      expect(res._getStatusCode()).toBe(StatusCodes.OK);
      expect(Array.isArray(res._getJSONData())).toBe(true);
      expect(res._getJSONData().length).toBeLessThanOrEqual(10);
    },
  );
});
