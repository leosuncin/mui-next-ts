import faker from 'faker';
import {
  CONFLICT,
  METHOD_NOT_ALLOWED,
  OK,
  UNPROCESSABLE_ENTITY,
} from 'http-status-codes';

describe('Register API', () => {
  it('should validate the request method', () => {
    cy.api({
      url: '/api/auth/register',
      failOnStatusCode: false,
    })
      .its('status')
      .should('equal', METHOD_NOT_ALLOWED);
  });

  it('should validate the body', () => {
    cy.api({
      url: '/api/auth/register',
      method: 'POST',
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.equal(UNPROCESSABLE_ENTITY);
      expect(body).to.haveOwnProperty('message');
      expect(Array.isArray(body.message)).to.be.equal(true);
    });
  });

  it('should reject duplicate user', () => {
    const body = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: 'jane@doe.me',
      password: 'ji32k7au4a83',
    };

    cy.api({
      url: '/api/auth/register',
      method: 'POST',
      body,
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.equal(CONFLICT);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.match(/already registered/);
    });
  });

  it('should register a new user', () => {
    const body = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };

    cy.api({
      url: '/api/auth/register',
      method: 'POST',
      body,
    }).then(response => {
      expect(response.status).to.equal(OK);
      expect(response.body).to.haveOwnProperty('username', body.email);
      expect(response.body).to.haveOwnProperty(
        'name',
        `${body.firstName} ${body.lastName}`,
      );
      expect(response.body).not.to.haveOwnProperty('password');
    });
  });
});
