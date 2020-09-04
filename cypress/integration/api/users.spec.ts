import fc from 'fast-check';
import { OK } from 'http-status-codes';

describe('Users API', () => {
  const url = '/api/users';

  it('should list the users', () => {
    cy.login(Cypress.env('username'), Cypress.env('password'));

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
