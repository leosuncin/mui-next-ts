import { NextApiRequest, NextApiResponse } from 'next';

import { User } from './user';

export type NextHttpHandler<T = unknown> = (
  req: NextApiRequest & { user: User },
  res: NextApiResponse<T | Error>,
) => Promise<void> | void;
