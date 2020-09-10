import { post } from 'libs/request';
import { CreateTodo, TodoResponse as Todo } from 'types';

export default async function createTodo(
  body: CreateTodo,
  signal?: AbortSignal,
): Promise<Todo> {
  const req = new Request('/api/todos', { signal });
  return post<CreateTodo, Todo>(req, body);
}
