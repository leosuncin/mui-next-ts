import { post } from 'libs/request';
import { User } from 'pages/api/auth/login';

export type AuthLogin = {
  username: string;
  password: string;
};

export default async function login(body: AuthLogin): Promise<User> {
  return post<AuthLogin, User>('/api/auth/login', body);
}
