import faker from 'faker';
import { StatusCodes } from 'http-status-codes';

describe('Register API', () => {
  it('should validate the request method', () => {
    cy.api({
      url: '/api/auth/register',
      failOnStatusCode: false,
    })
      .its('status')
      .should('equal', StatusCodes.METHOD_NOT_ALLOWED);
  });

  it('should validate the body', () => {
    cy.api({
      url: '/api/auth/register',
      method: 'POST',
      body: {},
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.equal(StatusCodes.UNPROCESSABLE_ENTITY);
      expect(body).to.haveOwnProperty('message');
      expect(body).to.haveOwnProperty('errors');
    });
  });

  it('should reject duplicate user', () => {
    const body = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: 'jane_doe',
      password: 'ji32k7au4a83',
    };

    cy.api({
      url: '/api/auth/register',
      method: 'POST',
      body,
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.equal(StatusCodes.CONFLICT);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.match(/already registered/);
    });
  });

  it('should register a new user', () => {
    const body = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      username: faker.internet.userName().toLowerCase(),
      password: faker.internet.password(),
    };

    cy.api({
      url: '/api/auth/register',
      method: 'POST',
      body,
    }).then(response => {
      expect(response.status).to.equal(StatusCodes.OK);
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
      expect(response.body).to.haveOwnProperty('username', body.username);
      expect(response.body).not.to.haveOwnProperty('password');
    });
  });
});
