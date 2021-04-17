import { createModel } from '@xstate/test';
import faker from 'faker';
import { users } from 'libs/db/users';
import createMachineWithTests, {
  FillEvent,
} from 'machines/register-test-machine';

const firstNameLabel = /first name/i;
const lastNameLabel = /last name/i;
const usernameLabel = /username/i;
const passwordLabel = /password/i;
const submitButton = /sign me up/i;
const firstNameErrorText = /first name should not be empty/i;
const lastNameErrorText = /last name should not be empty/i;
const usernameErrorText = /username.+(?:empty|too short)/i;
const passwordErrorText = /password.+(?:empty|too short)/i;
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
    cy.findByText(/username or email already registered/i).should('exist');
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
        {
          firstName: 'a{backspace}{enter}',
          lastName: faker.name.lastName(),
          username: faker.internet.userName(),
          password: 'Pa$$w0rd!',
        },
        {
          firstName: faker.name.firstName(),
          lastName: 'a{backspace}{enter}',
          username: faker.internet.userName(),
          password: 'ji32k7au4a83',
        },
        {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          username: 'a{backspace}{enter}',
          password: '12345678',
        },
        {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          username: faker.internet.userName(),
          password: 'a{backspace}{enter}',
        },
        {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          username: faker.lorem.word().slice(0, 4) + '{enter}',
          password: faker.internet.password(),
        },
        {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          username: faker.internet.userName(),
          password: faker.internet.password(7) + '{enter}',
        },
        {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          username: faker.internet.userName(),
          password: faker.internet.password(12, true),
        },
        {
          firstName: faker.random.arrayElement(users).firstName,
          lastName: faker.random.arrayElement(users).lastName,
          username: faker.random.arrayElement(users).username,
          password: faker.internet.password(10, true),
        },
      ],
    },
    SUBMIT(cy: Cypress.cy) {
      cy.findByText(submitButton).click();
    },
  },
});
describe('Register page', () => {
  const testPlans = testModel.getSimplePathPlans();

  for (const plan of testPlans) {
    describe(plan.description, () => {
      for (const path of plan.paths) {
        it(path.description, () => {
          cy.intercept('POST', '/api/auth/register')
            .as('sendRegister')
            .visit('/register')
            .then(async () => path.test(cy));
        });
      }
    });
  }

  // It('coverage', () => {
  //   testModel.testCoverage();
  // });

  it('should go to login', () => {
    cy.intercept('POST', '/api/auth/register')
      .as('sendRegister')
      .visit('/register');

    cy.findByText(/log in/i).click();

    cy.waitUntil(() =>
      cy.location('pathname').then(pathname => pathname !== '/register'),
    )
      .location('pathname')
      .should('equal', '/login');
  });
});
