import 'whatwg-fetch';

import { setupServer } from 'msw/node';

import loginHandler from './handlers/login-handler';
import registerHandler from './handlers/register-handler';

const server = setupServer(loginHandler, registerHandler);

export * from './handlers/handle-with-error';
export default server;
