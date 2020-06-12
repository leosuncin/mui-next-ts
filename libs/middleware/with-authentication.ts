import { nSQL } from '@nano-sql/core';
import { UNAUTHORIZED } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { parseCookies } from 'nookies';
import { JwtPayload, NextHttpHandler, User } from 'types';

function extractTokenFromCookies(req: NextApiRequest) {
  const cookies = parseCookies({ req });

  return cookies.token;
}

function extractTokenFromHeaders(req: NextApiRequest) {
  const { authorization } = req.headers;

  if (!authorization) return;

  const [, token] = /Bearer (.*)/.exec(authorization);

  return token;
}

function isJWT(token: string): boolean {
  const urlSafeBase64 = /^[A-Z0-9_-]+$/i;
  const parts = token.split('.');

  if (parts.length > 3 || parts.length < 2) return false;

  return parts.reduce((valid, part) => valid && urlSafeBase64.test(part), true);
}

export function withAuthentication(handler: NextHttpHandler): NextHttpHandler {
  return async (req, res) => {
    const token = extractTokenFromCookies(req) ?? extractTokenFromHeaders(req);

    if (!token || !isJWT(token))
      return res.status(UNAUTHORIZED).json({
        statusCode: UNAUTHORIZED,
        message: 'Missing or invalid authorization token',
      });

    const payload = jwt.verify(token, process.env.APP_SECRET) as JwtPayload;
    const [user] = (await nSQL('users')
      .query('select', [
        'id',
        'firstName',
        'lastName',
        'username',
        'picture',
        'bio',
      ])
      .where(['id', '=', payload.sub])
      .exec()) as User[];

    if (!user)
      return res.status(UNAUTHORIZED).json({
        statusCode: UNAUTHORIZED,
        message: 'Invalid user from token',
      });

    req.user = user;

    return handler(req, res);
  };
}
