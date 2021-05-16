import fc from 'fast-check';
import { StatusCodes } from 'http-status-codes';
import { users } from 'src/libs/db/users';

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
          })
            .validateResponse(StatusCodes.OK, 'User')
            .its('body')
            .should('have.length.lte', Math.abs(qs.limit ?? 10));
        },
      ),
      { numRuns: 10 },
    );
  });
});
