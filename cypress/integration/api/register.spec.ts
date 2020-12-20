import faker from 'faker';
import { StatusCodes } from 'http-status-codes';

describe('Register API', () => {
  it('should validate the request method', () => {
    cy.api({
      url: '/api/auth/register',
      failOnStatusCode: false,
    }).validateResponse(StatusCodes.METHOD_NOT_ALLOWED, 'ApiError');
  });

  it('should validate the body', () => {
    cy.api({
      url: '/api/auth/register',
      method: 'POST',
      body: {},
      failOnStatusCode: false,
    }).validateResponse(StatusCodes.UNPROCESSABLE_ENTITY, 'ApiError');
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
    }).validateResponse(StatusCodes.CONFLICT, 'ApiError');
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
    })
      .validateResponse(StatusCodes.OK, 'User')
      .then(response => {
        expect(response.headers).to.haveOwnProperty('authorization');
        expect(response.headers.authorization).to.match(/Bearer \w+/);
        expect(response.headers).to.haveOwnProperty('set-cookie');
        expect(response.headers['set-cookie']).to.satisfy((cookies: string[]) =>
          cookies.some(cookie =>
            /token=.*; Max-Age=\d+; Path=\/; HttpOnly; SameSite=Strict/.test(
              cookie,
            ),
          ),
        );
        expect(response.body).to.haveOwnProperty('username', body.username);
      });
  });
});
