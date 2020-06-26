import 'whatwg-fetch';

import { setupServer } from 'msw/node';

import listUserHandler from './handlers/list-user-handler';
import loginHandler from './handlers/login-handler';
import registerHandler from './handlers/register-handler';

const server = setupServer(loginHandler, registerHandler, listUserHandler);

export * from './handlers/handle-with-error';
export default server;
