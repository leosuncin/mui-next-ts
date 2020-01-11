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
    cy.findByLabelText(firstNameLabel)
      .type(faker.name.firstName())
      .findByLabelText(lastNameLabel)
      .type(faker.name.lastName())
      .findByLabelText(emailLabel)
      .type(faker.internet.exampleEmail())
      .findByLabelText(passwordLabel)
      .type('Pa$$w0rd!')
      .findByText(submitButton)
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
    cy.findByText(submitButton)
      .click()
      .findByText(/First name should not be empty/i)
      .findByText(/Last name should not be empty/i)
      .findByText(/Email should not be empty/i)
      .findByText(/Password should not be empty/i);

    cy.findByLabelText(emailLabel)
      .type(faker.internet.userName())
      .findByLabelText(passwordLabel)
      .type('pwd')
      .findByText(/Email is invalid/i)
      .findByText(/Password too short/i);
  });

  it('should shown the error for duplicate user', () => {
    cy.findByLabelText(firstNameLabel)
      .type('Jane')
      .findByLabelText(lastNameLabel)
      .type('Doe')
      .findByLabelText(emailLabel)
      .type('jane@doe.me')
      .findByLabelText(passwordLabel)
      .type('!drowssap')
      .findByText(submitButton)
      .click()
      .wait('@sendRegister')
      .its('status')
      .should('be', 409)
      .findByText(/already registered/i);
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
