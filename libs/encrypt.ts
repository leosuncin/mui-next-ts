import { randomBytes, pbkdf2Sync } from 'crypto';

function genSalt(length = 16): string {
  return randomBytes(Math.ceil(length / 2)).toString('hex');
}

export function hashPassword(password: string, length = 16): string {
  const iterations = 100;
  const digest = 'sha512';
  const salt = genSalt(length);

  const hash = pbkdf2Sync(password, salt, iterations, length, digest);
  const tmpBuffer = Buffer.from(hash.toString('hex') + ':' + salt);

  return tmpBuffer.toString('base64');
}

export function comparePassword(hash: string, password: string): boolean {
  const iterations = 100;
  const digest = 'sha512';
  const auxBuffer = Buffer.from(hash, 'base64');
  const [key, salt] = auxBuffer.toString('utf-8').split(':');
  const tmpHash = pbkdf2Sync(password, salt, iterations, salt.length, digest);

  return key === tmpHash.toString('hex');
}
