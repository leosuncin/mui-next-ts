import { NO_CONTENT } from 'http-status-codes';
import { validateMethod } from 'libs/middleware/validate-method';
import { destroyCookie } from 'nookies';
import { NextHttpHandler } from 'types';

const logout: NextHttpHandler = (req, res) => {
  destroyCookie({ res }, 'token', { httpOnly: true, path: '/' });
  destroyCookie({ res }, 'sessionUser', { path: '/' });

  res.status(NO_CONTENT).send(Buffer.alloc(0));
};

export default validateMethod(['DELETE'], logout);
