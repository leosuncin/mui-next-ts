import { createModel } from '@xstate/test';

import { users } from '@app/libs/db/users';
import createMachineWithTests, {
  FillEvent,
} from '@app/machines/register-test-machine';
import { randomArrayElement, registerBuild } from '@app/utils/factories';

const firstNameLabel = /First name/i;
const lastNameLabel = /Last name/i;
const usernameLabel = /Username/i;
const passwordLabel = /Password/i;
const submitButton = /Sign Me Up/i;
const firstNameErrorText = /First name should not be empty/i;
const lastNameErrorText = /Last name should not be empty/i;
const usernameErrorText = /Username.+(?:empty|too short)/i;
const passwordErrorText = /Password.+(?:empty|too short)/i;
const testMachine = createMachineWithTests({
  pristine(cy: Cypress.cy) {
    cy.findByRole('img', { name: 'sad face' }).should('not.exist');
  },
  'invalid.firstName'(cy: Cypress.cy) {
    cy.findByText(firstNameErrorText).should('exist');
  },
  'invalid.lastName'(cy: Cypress.cy) {
    cy.findByText(lastNameErrorText).should('exist');
  },
  'invalid.username'(cy: Cypress.cy) {
    cy.findByText(usernameErrorText).should('exist');
  },
  'invalid.password'(cy: Cypress.cy) {
    cy.findByText(passwordErrorText).should('exist');
  },
  valid(cy: Cypress.cy) {
    cy.findByText(firstNameErrorText).should('not.exist');
    cy.findByText(lastNameErrorText).should('not.exist');
    cy.findByText(usernameErrorText).should('not.exist');
    cy.findByText(passwordErrorText).should('not.exist');
  },
  success(cy: Cypress.cy) {
    cy.wait('@sendRegister').its('response.statusCode').should('equal', 200);
    cy.waitUntil(() =>
      cy.location('pathname').then(pathname => pathname !== '/register'),
    )
      .location('pathname')
      .should('equal', '/');
  },
  fail(cy: Cypress.cy) {
    cy.wait('@sendRegister').its('response.statusCode').should('equal', 409);
    cy.findByRole('img', { name: 'sad face' }).should('be.visible');
    cy.findByText(/Username or Email already registered/i).should('exist');
  },
});
const testModel = createModel(testMachine, {
  events: {
    FILL_FORM: {
      exec(cy: Cypress.cy, event: FillEvent) {
        cy.findByLabelText(firstNameLabel).clear().type(event.firstName);
        cy.findByLabelText(lastNameLabel).clear().type(event.lastName);
        cy.findByLabelText(usernameLabel).clear().type(event.username);
        cy.findByLabelText(passwordLabel).clear().type(event.password);
      },
      cases: [
        registerBuild({
          overrides: {
            firstName: 'a{backspace}{enter}',
            password: 'Pa$$w0rd!',
          },
        }),
        registerBuild({
          overrides: {
            lastName: 'a{backspace}{enter}',
            password: 'ji32k7au4a83',
          },
        }),
        registerBuild({
          overrides: {
            username: 'a{backspace}{enter}',
            password: '12345678',
          },
        }),
        registerBuild({
          overrides: {
            password: 'a{backspace}{enter}',
          },
        }),
        registerBuild({
          map: register => ({
            ...register,
            username: register.username.substr(0, 4) + '{enter}',
          }),
        }),
        registerBuild({
          map: register => ({
            ...register,
            password: register.password.substr(0, 7) + '{enter}',
          }),
        }),
        registerBuild(),
        registerBuild({
          overrides: {
            firstName: randomArrayElement(users).firstName,
            lastName: randomArrayElement(users).lastName,
            username: randomArrayElement(users).username,
          },
        }),
      ],
    },
    SUBMIT(cy: Cypress.cy) {
      cy.findByText(submitButton).click();
    },
  },
});
describe('Register page', () => {
  const testPlans = testModel.getSimplePathPlans();

  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(path.description, () => {
          cy.intercept('POST', '/api/auth/register')
            .as('sendRegister')
            .visit('/register')
            .then(() => {
              path.test(cy);
            });
        });
      });
    });
  });

  // it('coverage', () => {
  //   testModel.testCoverage();
  // });

  it('should go to login', () => {
    cy.intercept('POST', '/api/auth/register')
      .as('sendRegister')
      .visit('/register');

    cy.findByText(/Log in/i).click();

    cy.waitUntil(() =>
      cy.location('pathname').then(pathname => pathname !== '/register'),
    )
      .location('pathname')
      .should('equal', '/login');
  });
});
