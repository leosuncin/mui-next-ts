import { uuid } from '@nano-sql/core/lib/interfaces';

export interface Todo {
  id: uuid;
  text: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: uuid;
}

export interface TodoResponse {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type CreateTodo = {
  text: string;
};

export type UpdateTodo = { text: string } | { done: boolean };
