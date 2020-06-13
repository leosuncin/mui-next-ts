import jwt from 'jsonwebtoken';
import { JwtPayload, User } from 'types';

const secret = process.env.APP_SECRET;
const issuer = process.env.JWT_ISSUER;

export function signJWT(user: User): string {
  return jwt.sign(
    {
      sub: user.id,
      iss: issuer,
    },
    secret,
    { expiresIn: '30 days', algorithm: 'HS384' },
  );
}

export function decodeJWT(token: string): JwtPayload {
  return jwt.verify(token, secret, {
    algorithms: ['HS384'],
    ignoreExpiration: false,
    issuer,
  }) as JwtPayload;
}
