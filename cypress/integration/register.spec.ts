// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />
/// <reference types="@types/testing-library__cypress" />
/// <reference types="cypress-wait-until" />
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
    cy.findByText(/Email should not be empty/i);
    cy.findByText(/Password should not be empty/i);

    cy.findByLabelText(emailLabel).type(faker.internet.userName());
    cy.findByLabelText(passwordLabel).type('pwd');
    cy.findByText(/Email is invalid/i);
    cy.findByText(/Password too short/i);
  });

  it('should shown the error for duplicate user', () => {
    cy.findByLabelText(firstNameLabel).type('Jane');
    cy.findByLabelText(lastNameLabel).type('Doe');
    cy.findByLabelText(emailLabel).type('jane@doe.me');
    cy.findByLabelText(passwordLabel).type('!drowssap');
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
