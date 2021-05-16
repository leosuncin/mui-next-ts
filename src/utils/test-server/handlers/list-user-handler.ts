import { RequestHandler, rest } from 'msw';

import { db } from '@app/utils/db';
import { userBuild } from '@app/utils/factories';

const listUserHandler: RequestHandler = rest.get(
  '/api/users',
  (req, res, ctx) => {
    const limit = parseInt(req.url.searchParams.get('limit'), 10) || 10;
    const users = db.users.findMany({ take: limit });
    while (users.length < limit) {
      users.push(db.users.create(userBuild() as unknown));
    }

    return res(ctx.delay(60), ctx.json(users));
  },
);

export default listUserHandler;
