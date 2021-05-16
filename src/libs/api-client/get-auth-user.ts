import { get } from '@app/libs/request';
import { UserWithoutPassword as User } from '@app/types';

export default async function getAuthUser(): Promise<User> {
  return get<User>(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/auth/me`);
}
