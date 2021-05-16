import { get } from 'libs/request';
import { UserWithoutPassword as User } from 'types';

import { PaginationParams } from '.';

export default async function listUser({
  page = 1,
  offset = 0,
  limit = 10,
  signal,
}: Partial<PaginationParams> = {}): Promise<User[]> {
  const searchParams = new URLSearchParams();

  if (offset > 0) searchParams.set('offset', String(offset));
  else searchParams.set('page', String(page));

  if (limit !== 10) searchParams.set('limit', String(limit));

  return get<User[]>(`/api/users?${searchParams.toString()}`, signal);
}
