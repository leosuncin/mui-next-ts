import { validateMethod, withAuthentication, withDB } from 'libs/middleware';

export default validateMethod(
  ['GET'],
  withDB(withAuthentication((req, res) => res.json(req.user))),
);
