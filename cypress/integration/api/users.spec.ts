import fc from 'fast-check';
import { OK } from 'http-status-codes';
import { users } from 'libs/db/users';

describe('Users API', () => {
  const url = '/api/users';
  let authorization: string;

  beforeEach(() => {
    cy.task('signUser', users[0]).then((jwt: string) => {
      authorization = `Bearer ${jwt}`;
    });
  });

  it('should list the users', () => {
    fc.assert(
      fc.property(
        fc.record<{ limit: number; page: number; offset: number }>({
          limit: fc.integer(),
          page: fc.integer(),
          offset: fc.integer(),
        }),
        qs => {
          cy.api({
            url,
            qs,
            headers: { authorization },
            failOnStatusCode: false,
          }).then(({ status, body }) => {
            expect(status).to.be.equal(OK);
            expect(body).to.satisfy((body: unknown) => Array.isArray(body));
          });
        },
      ),
      { numRuns: 10 },
    );
  });
});
