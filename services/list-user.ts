import { get } from 'libs/request';
import { UserWithoutPassword as User } from 'types';

type ListParams = {
  page: number;
  offset: number;
  limit: number;
  signal: AbortSignal;
};

export default async function listUser({
  page = 1,
  offset = 0,
  limit = 10,
  signal,
}: Partial<ListParams> = {}): Promise<User[]> {
  const searchParams = new URLSearchParams();

  if (offset > 0) searchParams.set('offset', offset as any);
  else searchParams.set('page', page as any);

  if (limit !== 10) searchParams.set('limit', limit as any);

  return get<User[]>(`/api/users?${searchParams.toString()}`, signal);
}
