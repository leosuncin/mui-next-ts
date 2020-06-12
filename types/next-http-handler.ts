import { NextApiRequest, NextApiResponse } from 'next';

export type NextHttpHandler<T = unknown> = (
  req: NextApiRequest,
  res: NextApiResponse<T | Error>,
) => Promise<void> | void;
