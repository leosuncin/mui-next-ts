// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import { assertSchema } from '@cypress/schema-tools';

import { formats, schemas } from '../schemas';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable {
      login(username: string, password: string): Chainable<Cypress.Response>;
      validateResponse(
        statusCode: number,
        schema: string,
        version?: string,
      ): Chainable<Cypress.Response>;
    }
  }
}

//
// -- This is a parent command --
Cypress.Commands.add('login', (username, password) => {
  Cypress.Cookies.preserveOnce('token', 'sessionUser');
  return cy
    .clearCookies()
    .request('POST', '/api/auth/login', { username, password });
});
//
// -- This is a child command --
Cypress.Commands.add(
  'validateResponse',
  { prevSubject: true },
  async (
    subject: Cypress.Response,
    statusCode: number,
    schema: string,
    version = '1.0.0',
  ) => {
    if (Array.isArray(subject.body))
      subject.body.forEach(item =>
        assertSchema(schemas, formats)(schema, version)(item),
      );
    else assertSchema(schemas, formats)(schema, version)(subject.body);
    expect(subject.status).to.be.equal(statusCode);

    return subject;
  },
);
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
