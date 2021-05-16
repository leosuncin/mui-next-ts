import { StatusCodes } from 'http-status-codes';
import { destroyCookie } from 'nookies';

import { catchErrors, validateMethod } from '@app/libs/middleware';
import { NextHttpHandler } from '@app/types';

const logout: NextHttpHandler = (_, res) => {
  destroyCookie({ res }, 'token', { httpOnly: true, path: '/' });
  destroyCookie({ res }, 'sessionUser', { path: '/' });

  res.status(StatusCodes.NO_CONTENT).send(Buffer.alloc(0));
};

export default catchErrors(validateMethod(['DELETE'])(logout));
