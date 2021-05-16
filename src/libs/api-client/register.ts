import { post } from '@app/libs/request';
import { AuthRegister, UserWithoutPassword as User } from '@app/types';

export default async function register(body: AuthRegister): Promise<User> {
  return post<AuthRegister, User>('/api/auth/register', body);
}
