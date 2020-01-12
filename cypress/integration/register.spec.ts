// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />
/// <reference types="@types/testing-library__cypress" />
/// <reference types="cypress-wait-until" />
import faker from 'faker';

import { firstName, lastName, email, password } from '../../validations';

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
      .findByText(firstName.required)
      .findByText(lastName.required)
      .findByText(email.required)
      .findByText(password.required);

    cy.findByLabelText(emailLabel)
      .type(faker.internet.userName())
      .findByLabelText(passwordLabel)
      .type('pwd')
      .findByText(email.pattern.message)
      .findByText(password.minLength.message);
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
