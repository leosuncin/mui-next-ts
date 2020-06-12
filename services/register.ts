import { post } from 'libs/request';
import { UserWithoutPassword as User } from 'types';

export type AuthRegister = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

export default async function register(body: AuthRegister): Promise<User> {
  return post<AuthRegister, User>('/api/auth/register', body);
}
