// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />
/// <reference types="@types/testing-library__cypress" />

describe('Login page', () => {
  const usernameLabel = /Username/i;
  const passwordLabel = /Password/i;
  const submitButton = /Log me in/i;

  beforeEach(() => {
    cy.server()
      .route('POST', '/api/auth/login')
      .as('sendLogin')
      .visit('/login');
  });

  it('should login', () => {
    cy.findByLabelText(usernameLabel)
      .type('admin')
      .findByLabelText(passwordLabel)
      .type('Pa$$w0rd!')
      .findByText(submitButton)
      .click()
      .wait('@sendLogin')
      .its('status')
      .should('be', 200)
      .waitUntil(() =>
        cy.location('pathname').then(pathname => pathname !== '/login'),
      )
      .location('pathname')
      .should('equal', '/');
  });

  it('should validate the credentials', () => {
    cy.findByText(submitButton)
      .click()
      .findByText(/Username should not be empty/i)
      .findByText(/Password should not be empty/i);

    cy.findByLabelText(usernameLabel)
      .type('user')
      .findByLabelText(passwordLabel)
      .type('pwd')
      .findByText(/Username too short/i)
      .findByText(/Password too short/i);
  });

  it('should show incorrect username', () => {
    cy.findByLabelText(usernameLabel)
      .type('nobody')
      .findByLabelText(passwordLabel)
      .type('Pa$$w0rd!')
      .findByText(submitButton)
      .click()
      .wait('@sendLogin')
      .its('status')
      .should('be', 401)
      .findByText(/any user with username/i);
  });

  it('should show incorrect password', () => {
    cy.findByLabelText(usernameLabel)
      .type('admin')
      .findByLabelText(passwordLabel)
      .type('Password')
      .findByText(submitButton)
      .click()
      .wait('@sendLogin')
      .its('status')
      .should('be', 401)
      .findByText(/Wrong password/i);
  });

  it('should go to register', () => {
    cy.findByText(/Register/i)
      .click()
      .waitUntil(() =>
        cy.location('pathname').then(pathname => pathname !== '/login'),
      )
      .location('pathname')
      .should('equal', '/register');
  });
});
