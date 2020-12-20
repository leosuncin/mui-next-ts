import { StatusCodes } from 'http-status-codes';
import { catchErrors, validateMethod } from 'libs/middleware';
import { destroyCookie } from 'nookies';
import { NextHttpHandler } from 'types';

const logout: NextHttpHandler = (_, res) => {
  destroyCookie({ res }, 'token', { httpOnly: true, path: '/' });
  destroyCookie({ res }, 'sessionUser', { path: '/' });

  res.status(StatusCodes.NO_CONTENT).send(Buffer.alloc(0));
};

export default catchErrors(validateMethod(['DELETE'])(logout));
