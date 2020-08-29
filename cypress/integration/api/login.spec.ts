import faker from 'faker';
import {
  METHOD_NOT_ALLOWED,
  OK,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from 'http-status-codes';

describe('Login API', () => {
  it('should validate the request method', () => {
    cy.api({
      url: '/api/auth/login',
      failOnStatusCode: false,
    })
      .its('status')
      .should('be.equal', METHOD_NOT_ALLOWED);
  });

  it('should validate the body', () => {
    cy.api({
      url: '/api/auth/login',
      method: 'POST',
      body: {},
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.equal(UNPROCESSABLE_ENTITY);
      expect(body).to.haveOwnProperty('message');
      expect(body).to.haveOwnProperty('errors');
    });
  });

  it('should validate the username', () => {
    cy.api({
      url: '/api/auth/login',
      method: 'POST',
      body: {
        username: faker.internet.userName(),
        password: faker.internet.password(),
      },
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.equal(UNAUTHORIZED);
      expect(body.message).to.match(/username/);
    });
  });

  it('should validate the password', () => {
    cy.api({
      url: '/api/auth/login',
      method: 'POST',
      body: {
        username: 'admin',
        password: 'ji32k7au4a83',
      },
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.equal(UNAUTHORIZED);
      expect(body.message).to.match(/Wrong\s+password/);
    });
  });

  it('should validate the correct credentials', () => {
    cy.api({
      url: '/api/auth/login',
      method: 'POST',
      body: {
        username: 'admin',
        password: 'Pa$$w0rd!',
      },
    }).then(response => {
      expect(response.status).to.equal(OK);
      expect(response.headers).to.haveOwnProperty('authorization');
      expect(response.headers.authorization).to.match(/Bearer \w+/);
      expect(response.headers).to.haveOwnProperty('set-cookie');
      expect(response.headers['set-cookie']).to.satisfy(cookies =>
        cookies.some(cookie =>
          /token=.*; Max-Age=\d+; Path=\/; HttpOnly; SameSite=Strict/.test(
            cookie,
          ),
        ),
      );
      expect(response.body).to.haveOwnProperty('username', 'admin');
      expect(response.body).not.to.haveOwnProperty('password');
    });
  });
});
