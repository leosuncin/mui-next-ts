import { post } from '@app/libs/request';
import { CreateTodo, TodoResponse as Todo } from '@app/types';

export default async function createTodo(
  body: CreateTodo,
  signal?: AbortSignal,
): Promise<Todo> {
  return post<CreateTodo, Todo>('/api/todos', body, signal);
}
