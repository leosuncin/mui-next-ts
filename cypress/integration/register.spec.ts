import faker from 'faker';

describe('Register page', () => {
  const firstNameLabel = /First nam/i;
  const lastNameLabel = /Last name/i;
  const emailLabel = /Email/i;
  const passwordLabel = /Password/i;
  const submitButton = /Sign Me Up/i;

  beforeEach(() => {
    cy.server()
      .route('POST', '/api/auth/register')
      .as('sendRegister')
      .visit('/register');
  });

  it('should register', () => {
    cy.findByLabelText(firstNameLabel).type(faker.name.firstName());
    cy.findByLabelText(lastNameLabel).type(faker.name.lastName());
    cy.findByLabelText(emailLabel).type(faker.internet.exampleEmail());
    cy.findByLabelText(passwordLabel).type('Pa$$w0rd!');
    cy.findByText(submitButton).click();
    cy.wait('@sendRegister')
      .its('status')
      .should('be', 200)
      .waitUntil(() =>
        cy.location('pathname').then(pathname => pathname !== '/register'),
      )
      .location('pathname')
      .should('equal', '/');
  });

  it('should validate the data', () => {
    cy.findByLabelText(firstNameLabel).type('A{backspace}');
    cy.findByText(/First name should not be empty/i);
    cy.findByLabelText(lastNameLabel).type('Z{backspace}');
    cy.findByText(/Last name should not be empty/i);
    cy.findByLabelText(emailLabel).type('b{backspace}');
    cy.findByText(/Email should not be empty/i);
    cy.findByLabelText(passwordLabel).type('q{backspace}');
    cy.findByText(/Password should not be empty/i);

    cy.findByLabelText(firstNameLabel).type('A');
    cy.findByText(/First name too short/i);
    cy.findByLabelText(lastNameLabel).type('L');
    cy.findByText(/Last name too short/i);
    cy.findByLabelText(emailLabel).type(faker.internet.userName());
    cy.findByText(/Email is invalid/i);
    cy.findByLabelText(passwordLabel).type('pwd');
    cy.findByText(/Password too short/i);
  });

  it('should shown the error for duplicate user', () => {
    cy.findByLabelText(firstNameLabel).type('Jane');
    cy.findByLabelText(lastNameLabel).type('Doe');
    cy.findByLabelText(emailLabel).type('jane@doe.me');
    cy.findByLabelText(passwordLabel).type('!drowssap');
    cy.findByText(submitButton).click();
    cy.wait('@sendRegister').its('status').should('be', 409);
    cy.findByText(/already registered/i);
  });

  it('should go to login', () => {
    cy.findByText(/Log in/i)
      .click()
      .waitUntil(() =>
        cy.location('pathname').then(pathname => pathname !== '/register'),
      )
      .location('pathname')
      .should('equal', '/login');
  });
});
