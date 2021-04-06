import {
  catchErrors,
  validateMethod,
  withAuthentication,
  withDB,
} from 'libs/middleware';

export default catchErrors(
  validateMethod(['GET'])(
    withDB(
      withAuthentication((request, res) => {
        res.json(request.user);
      }),
    ),
  ),
);
