import { remove } from 'libs/request';

export default async function deleteTodo(id: string): Promise<void> {
  return remove(`/api/todos/${id}`);
}
