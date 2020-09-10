/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />
import { mount } from 'cypress-react-unit-test';
import fc from 'fast-check';
import React from 'react';

import RegisterForm from '../../components/forms/register';
import { registerBuild } from '../../utils/factories';

describe('RegisterForm component', () => {
  const firstNameLabel = /First name/i;
  const lastNameLabel = /Last name/i;
  const usernameLabel = /Username/i;
  const passwordLabel = /Password/i;
  const submitButton = /Sign Me Up/i;

  before(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      //
      // "Uncaught Error: No router instance found.
      // You should only use "next/router"
      return false;
    });
  });

  it('should submit the form', () => {
    const data = registerBuild();
    const onSubmit = cy.stub().as('handleSubmit');

    mount(<RegisterForm onSubmit={onSubmit} />);
    cy.findByLabelText(firstNameLabel).type(data.firstName);
    cy.findByLabelText(lastNameLabel).type(data.lastName);
    cy.findByLabelText(usernameLabel).type(data.username);
    cy.findByLabelText(passwordLabel).type(data.password);
    cy.findByRole('button', { name: submitButton }).click();

    cy.get('@handleSubmit').should('have.been.calledWith', data);
  });

  it('should validate the form', () => {
    const handleSubmit = cy.stub();

    fc.assert(
      fc
        .property(
          fc.record({
            firstName: fc.char(),
            lastName: fc.char(),
            username: fc.string(1, 4),
            password: fc.string(1, 7),
          }),
          data => {
            cy.findByLabelText(firstNameLabel)
              .type(data.firstName)
              .type('{backspace}');
            cy.findByLabelText(lastNameLabel)
              .type(data.lastName)
              .type('{backspace}');
            cy.findByLabelText(usernameLabel).type(data.username);
            cy.findByLabelText(passwordLabel).type(data.password);

            cy.findByRole('button', { name: submitButton }).click();

            cy.findByText(/First name should not be empty/i);
            cy.findByText(/Last name should not be empty/i);
            cy.findByText(/Username.+(?:empty|too short)/);
            cy.findByText(/Password.+(?:empty|too short)/);

            cy.wrap(handleSubmit).should('not.have.been.called');
          },
        )
        .beforeEach(() => {
          handleSubmit.reset();
          mount(<RegisterForm onSubmit={handleSubmit} />);
        }),
      { numRuns: 10 },
    );
  });
});
