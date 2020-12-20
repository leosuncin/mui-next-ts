import { createModel } from '@xstate/test';
import faker from 'faker';
import createMachineWithTests, { FillEvent } from 'machines/login-test-machine';

const usernameLabel = /Username/i;
const passwordLabel = /Password/i;
const submitButton = /Log me in/i;
const testMachine = createMachineWithTests({
  pristine: (cy: Cypress.cy) => {
    cy.findByLabelText('sad face').should('not.be.visible');
  },
  'invalid.username': (cy: Cypress.cy) => {
    cy.findByText(/Username.+(?:empty|too short)/).should('exist');
  },
  'invalid.password': (cy: Cypress.cy) => {
    cy.findByText(/Password.+(?:empty|too short)/).should('exist');
  },
  valid: (cy: Cypress.cy) => {
    cy.findByText(/Username.+(?:empty|too short)/).should('not.exist');
    cy.findByText(/Password.+(?:empty|too short)/).should('not.exist');
  },
  incorrectCredentials: (cy: Cypress.cy) => {
    cy.findByText(/Wrong (?:username|password)/i).should('exist');
  },
  success: (cy: Cypress.cy) => {
    cy.waitUntil(() =>
      cy.location('pathname').then(pathname => pathname !== '/login'),
    )
      .location('pathname')
      .should('equal', '/');
  },
  locked: (cy: Cypress.cy) => {
    cy.findByText(/Too many failed attempts/i).should('exist');
    cy.findByLabelText(usernameLabel).should('be.disabled');
    cy.findByLabelText(passwordLabel).should('be.disabled');
    cy.findByText(submitButton).parent().should('be.disabled');
  },
});
const testModel = createModel(testMachine, {
  events: {
    FILL_FORM: {
      exec(cy: Cypress.cy, event: FillEvent) {
        cy.findByLabelText(usernameLabel).clear().type(event.username);
        cy.findByLabelText(passwordLabel).clear().type(event.password).blur();
      },
      cases: [
        { username: 'user', password: faker.internet.password(7) },
        { username: 'user', password: faker.internet.password(12, true) },
        { username: 'admin', password: faker.internet.password() },
        {
          username: faker.lorem.word(),
          password: faker.internet.password(7),
        },
        {
          username: faker.internet.userName(),
          password: faker.internet.password(),
        },
        { username: 'admin', password: 'Pa$$w0rd!' },
      ],
    },
    SUBMIT(cy: Cypress.cy) {
      cy.findByText(submitButton)
        .click()
        .wait('@sendLogin')
        .its('response.statusCode')
        .should('satisfy', status => [200, 401].includes(status));
    },
    RETRY(cy: Cypress.cy) {
      cy.findByLabelText(passwordLabel)
        .clear()
        .type(faker.internet.password(12, true));
      cy.findByText(submitButton).click().wait('@sendLogin');

      cy.findByLabelText(passwordLabel)
        .clear()
        .type(faker.internet.password(18));
    },
  },
});

describe('Login page', () => {
  const testPlans = testModel.getSimplePathPlans();

  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(path.description, () =>
          cy
            .intercept('POST', '/api/auth/login')
            .as('sendLogin')
            .visit('/login')
            .then(() => path.test(cy)),
        );
      });
    });
  });

  // it('coverage', () => {
  //   testModel.testCoverage();
  // });

  it('should go to register', () => {
    cy.intercept('POST', '/api/auth/login').as('sendLogin').visit('/login');

    cy.findByText(/Register/i).click();

    cy.waitUntil(() =>
      cy.location('pathname').then(pathname => pathname !== '/login'),
    )
      .location('pathname')
      .should('equal', '/register');
  });
});
