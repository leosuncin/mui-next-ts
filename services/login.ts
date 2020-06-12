import { post } from 'libs/request';
import { UserWithoutPassword as User } from 'types';

export type AuthLogin = {
  username: string;
  password: string;
};

export default async function login(body: AuthLogin): Promise<User> {
  return post<AuthLogin, User>('/api/auth/login', body);
}
