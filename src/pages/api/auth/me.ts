import {
  catchErrors,
  validateMethod,
  withAuthentication,
  withDB,
} from '@app/libs/middleware';

export default catchErrors(
  validateMethod(['GET'])(
    withDB(withAuthentication((req, res) => res.json(req.user))),
  ),
);
