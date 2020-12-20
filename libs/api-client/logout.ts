import { remove } from 'libs/request';

export default async function logout() {
  return remove('/api/auth/logout');
}
