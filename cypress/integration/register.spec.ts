// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />
/// <reference types="@types/testing-library__cypress" />
/// <reference types="cypress-wait-until" />
import faker from 'faker';

describe('Register page', () => {
  const firstNameLabel = /First nam/i;
  const lastNameLabel = /Last name/i;
  const usernameLabel = /Username/i;
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
    cy.findByLabelText(usernameLabel).type(faker.internet.userName());
    cy.findByLabelText(passwordLabel).type('Pa$$w0rd!');
    cy.findByText(submitButton)
      .click()
      .wait('@sendRegister')
      .its('status')
      .should('be', 200)
      .waitUntil(() =>
        cy.location('pathname').then(pathname => pathname !== '/register'),
      )
      .location('pathname')
      .should('equal', '/');
  });

  it('should validate the data', () => {
    cy.findByText(submitButton).click();
    cy.findByText(/First name should not be empty/i);
    cy.findByText(/Last name should not be empty/i);
    cy.findByText(/Username should not be empty/i);
    cy.findByText(/Password should not be empty/i);

    cy.findByLabelText(usernameLabel).type(faker.lorem.word().substr(0, 4));
    cy.findByLabelText(passwordLabel).type('pwd').blur();
    cy.findByText(/Username too short/i);
    cy.findByText(/Password too short/i);
  });

  it('should shown the error for duplicate user', () => {
    cy.findByLabelText(firstNameLabel).type('Jane');
    cy.findByLabelText(lastNameLabel).type('Doe');
    cy.findByLabelText(usernameLabel).type('jane_doe');
    cy.findByLabelText(passwordLabel).type('ji32k7au4a83');
    cy.findByText(submitButton)
      .click()
      .wait('@sendRegister')
      .its('status')
      .should('be', 409);
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
