import { post } from 'libs/request';
import { AuthLogin, UserWithoutPassword as User } from 'types';

export default async function login(body: AuthLogin): Promise<User> {
  return post<AuthLogin, User>('/api/auth/login', body);
}
