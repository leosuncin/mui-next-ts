import { post } from 'src/libs/request';
import { AuthRegister, UserWithoutPassword as User } from 'src/types';

export default async function register(body: AuthRegister): Promise<User> {
  return post<AuthRegister, User>('/api/auth/register', body);
}
