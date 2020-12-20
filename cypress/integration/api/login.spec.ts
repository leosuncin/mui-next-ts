import faker from 'faker';
import { StatusCodes } from 'http-status-codes';

describe('Login API', () => {
  it('should validate the request method', () => {
    cy.api({
      url: '/api/auth/login',
      failOnStatusCode: false,
    }).validateResponse(StatusCodes.METHOD_NOT_ALLOWED, 'ApiError');
  });

  it('should validate the body', () => {
    cy.api({
      url: '/api/auth/login',
      method: 'POST',
      body: {},
      failOnStatusCode: false,
    }).validateResponse(StatusCodes.UNPROCESSABLE_ENTITY, 'ApiError');
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
    }).validateResponse(StatusCodes.UNAUTHORIZED, 'ApiError');
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
    }).validateResponse(StatusCodes.UNAUTHORIZED, 'ApiError');
  });

  it('should validate the correct credentials', () => {
    cy.api({
      url: '/api/auth/login',
      method: 'POST',
      body: {
        username: 'admin',
        password: 'Pa$$w0rd!',
      },
    })
      .validateResponse(StatusCodes.OK, 'User')
      .then(response => {
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
      });
  });
});
