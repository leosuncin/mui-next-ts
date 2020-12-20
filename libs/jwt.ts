import jwt from 'jsonwebtoken';
import { JwtPayload, User } from 'types';

export function signJWT(user: User): string {
  return jwt.sign(
    {
      sub: user.id,
      iss: process.env.JWT_ISSUER,
    },
    process.env.APP_SECRET,
    { expiresIn: '30 days', algorithm: 'HS384' },
  );
}

export function decodeJWT(token: string): JwtPayload {
  return jwt.verify(token, process.env.APP_SECRET, {
    algorithms: ['HS384'],
    ignoreExpiration: false,
    issuer: process.env.JWT_ISSUER,
  }) as JwtPayload;
}
