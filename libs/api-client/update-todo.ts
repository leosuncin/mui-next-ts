import { put } from 'libs/request';
import { TodoResponse as Todo, UpdateTodo } from 'types';

export default async function updateTodo(
  id: string,
  body: UpdateTodo,
  signal?: AbortSignal,
): Promise<Todo> {
  const req = new Request(`/api/todos/${id}`, { signal });
  return put<UpdateTodo, Todo>(req, body);
}
