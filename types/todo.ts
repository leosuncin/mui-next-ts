import { uuid } from '@nano-sql/core/lib/interfaces';

export interface Todo {
  id: uuid;
  text: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: uuid;
}
