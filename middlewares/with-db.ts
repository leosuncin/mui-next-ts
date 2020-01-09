import { NextApiRequest, NextApiResponse } from 'next';

import { Error } from 'pages/api/auth/login';

export type NextHttpHandler<T = Record<string, any>> = (
  req: NextApiRequest & { db: Map<string, string> },
  res: NextApiResponse<T | Error>,
) => Promise<void> | void;

const db = new Map<string, string>();
db.set(
  'admin',
  'MTc3NzI2ZmE4ZTUwYThhMWFhNWU0MjBjNzQyNzRjZDI6MzBjY2Y5ZDAxMzFiNmZkNQ==',
); // Pa$$w0rd!
db.set(
  'john_doe',
  'NWI0YTdhMGZhMjA1NmI3NTJmZjU1YWNmMjVmZTY2YjY6MzJlM2JjYzU3YTIxOTNkZA==',
); // Pa55w0rd!
db.set(
  'jane@doe.me',
  'MmNmMzhiNTZlZjAwMmY4MTgzNWQ5MzJmMTI2ZGE4MTA6YTAxYjIyMjlkYzIwODhhMQ==',
); // !drowssap

export default function withDbMiddleware(
  handler: NextHttpHandler,
): NextHttpHandler {
  return function withDB(req, res) {
    req.db = db;

    return handler(req, res);
  };
}
