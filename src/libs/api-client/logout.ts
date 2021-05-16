import { remove } from 'src/libs/request';

export default async function logout(): Promise<void> {
  return remove('/api/auth/logout');
}
