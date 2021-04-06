import {
  catchErrors,
  validateMethod,
  withAuthentication,
  withDB,
} from 'libs/middleware';

export default catchErrors(
  validateMethod(['GET'])(
    withDB(
      withAuthentication((request, response) => {
        response.json(request.user);
      }),
    ),
  ),
);
