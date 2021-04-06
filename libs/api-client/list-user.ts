import { get } from 'libs/request';
import { UserWithoutPassword as User } from 'types';

import { PaginationParams } from '.';

export default async function listUser({
  page = 1,
  offset = 0,
  limit = 10,
  signal,
}: Partial<PaginationParams> = {}): Promise<User[]> {
  const searchParameters = new URLSearchParams();

  if (offset > 0) searchParameters.set('offset', offset as any);
  else searchParameters.set('page', page as any);

  if (limit !== 10) searchParameters.set('limit', limit as any);

  return get<User[]>(`/api/users?${searchParameters.toString()}`, signal);
}
