import { remove } from 'libs/request';

export default async function logout(): Promise<void> {
  return remove('/api/auth/logout');
}
