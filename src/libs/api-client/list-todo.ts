import { get } from 'src/libs/request';
import { TodoResponse as Todo } from 'src/types';

import { PaginationParams } from '.';

export default async function listTodo({
  page = 1,
  offset = 0,
  limit = 10,
  signal,
}: Partial<PaginationParams> = {}): Promise<Todo[]> {
  const searchParams = new URLSearchParams();

  if (offset > 0) searchParams.set('offset', String(offset));
  else searchParams.set('page', String(page));

  if (limit !== 10) searchParams.set('limit', String(limit));

  return get<Todo[]>(`/api/todos?${searchParams.toString()}`, signal);
}
