import { remove } from '@app/libs/request';

export default async function deleteTodo(
  id: string,
  signal?: AbortSignal,
): Promise<void> {
  return remove(`/api/todos/${id}`, signal);
}
