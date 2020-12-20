import 'whatwg-fetch';

import { setupServer } from 'msw/node';

import createTodoHandler from './handlers/create-todo-handler';
import deleteTodoHandler from './handlers/delete-todo-handler';
import listTodoHandler from './handlers/list-todo-handler';
import listUserHandler from './handlers/list-user-handler';
import loginHandler from './handlers/login-handler';
import logoutHandler from './handlers/logout-handler';
import registerHandler from './handlers/register-handler';
import updateTodoHandler from './handlers/update-todo-handler';

const server = setupServer(
  loginHandler,
  registerHandler,
  listUserHandler,
  logoutHandler,
  createTodoHandler,
  listTodoHandler,
  updateTodoHandler,
  deleteTodoHandler,
);

export * from './handlers/handle-with-error';
export default server;
