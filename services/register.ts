import { post } from 'libs/request';
import { User } from 'pages/api/auth/login';

export type AuthRegister = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export default async function login(body: AuthRegister): Promise<User> {
  return post<AuthRegister, User>('/api/auth/register', body);
}
