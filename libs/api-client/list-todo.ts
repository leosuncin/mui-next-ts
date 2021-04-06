import { get } from 'libs/request';
import { TodoResponse as Todo } from 'types';

import { PaginationParams } from '.';

export default async function listTodo({
  page = 1,
  offset = 0,
  limit = 10,
  signal,
}: Partial<PaginationParams> = {}): Promise<Todo[]> {
  const searchParameters = new URLSearchParams();

  if (offset > 0) searchParameters.set('offset', offset as any);
  else searchParameters.set('page', page as any);

  if (limit !== 10) searchParameters.set('limit', limit as any);

  return get<Todo[]>(`/api/todos?${searchParameters.toString()}`, signal);
}
