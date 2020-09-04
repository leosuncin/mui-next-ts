import faker from 'faker';
import fc from 'fast-check';
import {
  CREATED,
  FORBIDDEN,
  NOT_FOUND,
  NO_CONTENT,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from 'http-status-codes';
import { todos } from 'libs/db/todos';
import { users } from 'libs/db/users';

describe('Todo API', () => {
  const url = '/api/todos';
  const todo = faker.random.arrayElement(
    todos.filter(t => t.createdBy === users[0].id),
  );
  let authorization: string;

  beforeEach(() => {
    cy.task('signUser', users[0]).then((jwt: string) => {
      authorization = `Bearer ${jwt}`;
    });
  });

  it('should create a new todo', () => {
    const text = faker.hacker.phrase();
    cy.api({
      url,
      method: 'POST',
      body: {
        text,
      },
      headers: { authorization },
    }).then(({ status, body }) => {
      expect(status).to.be.equal(CREATED);
      expect(body).to.haveOwnProperty('done', false);
      expect(body).to.haveOwnProperty('text', text);
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
        }).then(({ status, body }) => {
          expect(status).to.be.equal(UNPROCESSABLE_ENTITY);
          expect(body).to.have.keys(['statusCode', 'message', 'errors']);
        });
      }),
      { numRuns: 10 },
    );
  });

  it('should list the todos', () => {
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
            expect(status).to.be.equal(OK);
            expect(body).to.satisfy((body: unknown) => Array.isArray(body));
          });
        },
      ),
      { numRuns: 10 },
    );
  });

  it('should search by text', () => {
    cy.api({
      url,
      qs: { search: faker.hacker.verb() },
      headers: { authorization },
    }).then(({ status, body }) => {
      expect(status).to.be.equal(OK);
      expect(body).to.satisfy((body: unknown) => Array.isArray(body));
    });
  });

  it('should get one todo', () => {
    cy.api({
      url: url + '/' + todo.id,
      headers: { authorization },
    }).then(({ status, body }) => {
      expect(status).to.be.equal(OK);
      expect(body).to.have.keys([
        'id',
        'text',
        'done',
        'createdAt',
        'updatedAt',
        'createdBy',
      ]);
    });
  });

  it('should update one todo', () => {
    cy.api({
      url: url + '/' + todo.id,
      method: 'PUT',
      body: {
        text: faker.fake('Buy {{commerce.product}}'),
        done: !todo.done,
      },
      headers: { authorization },
    }).then(({ status, body }) => {
      expect(status).to.be.equal(OK);
      expect(body).to.have.keys([
        'id',
        'text',
        'done',
        'createdAt',
        'updatedAt',
        'createdBy',
      ]);
    });
  });

  it('should remove one todo', () => {
    cy.api({
      url,
      method: 'POST',
      body: {
        text: faker.lorem.sentence(),
      },
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
          .should('equal', NO_CONTENT);
      });
  });

  context('Todo not exist', () => {
    it('should fail to get', () => {
      cy.api({
        url: url + '/' + faker.random.uuid(),
        failOnStatusCode: false,
        headers: { authorization },
      }).then(({ status, body }) => {
        expect(status).to.be.equal(NOT_FOUND);
        expect(body).to.have.keys(['statusCode', 'message']);
      });
    });

    it('should fail to update', () => {
      cy.api({
        url: url + '/' + faker.random.uuid(),
        method: 'PUT',
        body: {
          text: faker.fake('Buy {{finance.amount}} x {{commerce.product}}'),
          done: !todo.done,
        },
        headers: { authorization },
        failOnStatusCode: false,
      })
        .its('status')
        .should('equal', NOT_FOUND);
    });

    it('should fail to remove', () => {
      cy.api({
        url: url + '/' + faker.random.uuid(),
        method: 'DELETE',
        headers: { authorization },
        failOnStatusCode: false,
      })
        .its('status')
        .should('equal', NOT_FOUND);
    });
  });

  context('Without authentication', () => {
    it('should fail to create a new todo', () => {
      cy.api({
        url,
        method: 'POST',
        body: { text: faker.lorem.sentence() },
        failOnStatusCode: false,
      })
        .its('status')
        .should('equal', UNAUTHORIZED);
    });

    it('should fail to list the todos', () => {
      cy.api({
        url,
        failOnStatusCode: false,
      })
        .its('status')
        .should('equal', UNAUTHORIZED);
    });

    it('should fail to get one todo', () => {
      cy.api({
        url: url + '/' + todo.id,
        failOnStatusCode: false,
      })
        .its('status')
        .should('equal', UNAUTHORIZED);
    });

    it('should fail to update one todo', () => {
      cy.api({
        url: url + '/' + todo.id,
        method: 'PUT',
        body: {
          text: faker.fake(`Buy {{commerce.product}}`),
          done: !todo.done,
        },
        failOnStatusCode: false,
      })
        .its('status')
        .should('equal', UNAUTHORIZED);
    });

    it('should fail to remove one todo', () => {
      cy.api({
        url: url + '/' + todo.id,
        method: 'DELETE',
        failOnStatusCode: false,
      })
        .its('status')
        .should('equal', UNAUTHORIZED);
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
      })
        .its('status')
        .should('equal', FORBIDDEN);
    });

    it('should forbid the update of one that belongs to another', () => {
      cy.api({
        url: url + '/' + todo.id,
        method: 'PUT',
        body: {
          text: faker.fake('Buy {{finance.amount}} x {{commerce.product}}'),
          done: !todo.done,
        },
        headers: { authorization },
        failOnStatusCode: false,
      })
        .its('status')
        .should('equal', FORBIDDEN);
    });

    it('should forbid the remove of one todo that belongs to another', () => {
      cy.api({
        url: url + '/' + todo.id,
        method: 'DELETE',
        headers: { authorization },
        failOnStatusCode: false,
      })
        .its('status')
        .should('equal', FORBIDDEN);
    });
  });
});
