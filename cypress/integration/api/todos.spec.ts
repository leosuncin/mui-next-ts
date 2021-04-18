import fc from 'fast-check';
import { StatusCodes } from 'http-status-codes';
import { todos } from 'libs/db/todos';
import { users } from 'libs/db/users';
import {
  createTodoBuild,
  randomArrayElement,
  todoBuild,
} from 'utils/factories';

describe('Todo API', () => {
  const url = '/api/todos';
  const todo = randomArrayElement(
    todos.filter(t => t.createdBy === users[0].id),
  );
  let authorization: string;

  beforeEach(() => {
    cy.task('signUser', users[0]).then((jwt: string) => {
      authorization = `Bearer ${jwt}`;
    });
  });

  it('should create a new todo', () => {
    const { text } = createTodoBuild();
    cy.api({
      url,
      method: 'POST',
      body: {
        text,
      },
      headers: { authorization },
    })
      .validateResponse(StatusCodes.CREATED, 'Todo')
      .its('body')
      .should(body => {
        expect(body).have.property('done', false);
        expect(body).have.property('text', text);
      });
  });

  it('should validate the body', () => {
    fc.assert(
      fc.property(fc.object({ maxDepth: 1 }), body => {
        fc.pre(!('text' in body));
        cy.api({
          url,
          method: 'POST',
          body,
          headers: { authorization },
          failOnStatusCode: false,
        }).validateResponse(StatusCodes.UNPROCESSABLE_ENTITY, 'ApiError');
      }),
      { numRuns: 10 },
    );
  });

  it.only('should list the todos', () => {
    cy.clearCookie('token');
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
          }).then(({ status, body }) => {
            expect(status).to.be.equal(StatusCodes.OK);
            expect(body).to.be.an('array');
            expect(body).to.have.length.lte(Math.abs(qs.limit ?? 10));
          });
        },
      ),
      { numRuns: 10 },
    );
  });

  it('should search by text', () => {
    cy.api({
      url,
      qs: { search: createTodoBuild({ traits: 'search' }).text },
      headers: { authorization },
    }).validateResponse(StatusCodes.OK, 'Todo');
  });

  it('should get one todo', () => {
    cy.api({
      url: url + '/' + todo.id,
      headers: { authorization },
    }).validateResponse(StatusCodes.OK, 'Todo');
  });

  it('should update one todo', () => {
    cy.api({
      url: url + '/' + todo.id,
      method: 'PUT',
      body: {
        ...createTodoBuild(),
        done: !todo.done,
      },
      headers: { authorization },
    }).validateResponse(StatusCodes.OK, 'Todo');
  });

  it('should remove one todo', () => {
    cy.api({
      url,
      method: 'POST',
      body: createTodoBuild(),
      headers: { authorization },
    })
      .its('body')
      .then(body => {
        cy.api({
          url: url + '/' + body.id,
          method: 'DELETE',
          headers: { authorization },
        })
          .its('status')
          .should('equal', StatusCodes.NO_CONTENT);
      });
  });

  context('Todo not exist', () => {
    it('should fail to get', () => {
      cy.api({
        url: url + '/' + todoBuild().id,
        failOnStatusCode: false,
        headers: { authorization },
      }).validateResponse(StatusCodes.NOT_FOUND, 'ApiError');
    });

    it('should fail to update', () => {
      cy.api({
        url: url + '/' + todoBuild().id,
        method: 'PUT',
        body: {
          ...createTodoBuild(),
          done: !todo.done,
        },
        headers: { authorization },
        failOnStatusCode: false,
      }).validateResponse(StatusCodes.NOT_FOUND, 'ApiError');
    });

    it('should fail to remove', () => {
      cy.api({
        url: url + '/' + todoBuild().id,
        method: 'DELETE',
        headers: { authorization },
        failOnStatusCode: false,
      }).validateResponse(StatusCodes.NOT_FOUND, 'ApiError');
    });
  });

  context('Without authentication', () => {
    it('should fail to create a new todo', () => {
      cy.api({
        url,
        method: 'POST',
        body: createTodoBuild(),
        failOnStatusCode: false,
      }).validateResponse(StatusCodes.UNAUTHORIZED, 'ApiError');
    });

    it('should fail to list the todos', () => {
      cy.api({
        url,
        failOnStatusCode: false,
      }).validateResponse(StatusCodes.UNAUTHORIZED, 'ApiError');
    });

    it('should fail to get one todo', () => {
      cy.api({
        url: url + '/' + todo.id,
        failOnStatusCode: false,
      }).validateResponse(StatusCodes.UNAUTHORIZED, 'ApiError');
    });

    it('should fail to update one todo', () => {
      cy.api({
        url: url + '/' + todo.id,
        method: 'PUT',
        body: {
          ...createTodoBuild(),
          done: !todo.done,
        },
        failOnStatusCode: false,
      }).validateResponse(StatusCodes.UNAUTHORIZED, 'ApiError');
    });

    it('should fail to remove one todo', () => {
      cy.api({
        url: url + '/' + todo.id,
        method: 'DELETE',
        failOnStatusCode: false,
      }).validateResponse(StatusCodes.UNAUTHORIZED, 'ApiError');
    });
  });

  context('With different user', () => {
    let authorization: string;

    beforeEach(() => {
      cy.task('signUser', users[1]).then((jwt: string) => {
        authorization = `Bearer ${jwt}`;
      });
    });

    it('should forbid the access one todo that belongs to another', () => {
      cy.api({
        url: url + '/' + todo.id,
        headers: { authorization },
        failOnStatusCode: false,
      }).validateResponse(StatusCodes.FORBIDDEN, 'ApiError');
    });

    it('should forbid the update of one that belongs to another', () => {
      cy.api({
        url: url + '/' + todo.id,
        method: 'PUT',
        body: {
          ...createTodoBuild(),
          done: !todo.done,
        },
        headers: { authorization },
        failOnStatusCode: false,
      }).validateResponse(StatusCodes.FORBIDDEN, 'ApiError');
    });

    it('should forbid the remove of one todo that belongs to another', () => {
      cy.api({
        url: url + '/' + todo.id,
        method: 'DELETE',
        headers: { authorization },
        failOnStatusCode: false,
      }).validateResponse(StatusCodes.FORBIDDEN, 'ApiError');
    });
  });
});
