export interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
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
