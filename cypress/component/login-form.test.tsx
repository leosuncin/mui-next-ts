import LoginForm from 'components/forms/login';
import { mount } from 'cypress-react-unit-test';
import faker from 'faker';
import fc from 'fast-check';
import React from 'react';
import { loginBuild } from 'utils/factories';

describe('LoginForm component', () => {
  const usernameLabel = /Username/i;
  const passwordLabel = /Password/i;
  const submitButton = /Log me in/i;

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
    const data = loginBuild();
    const onSubmit = cy.stub().as('handleSubmit');

    mount(<LoginForm onSubmit={onSubmit} />);
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
            username: fc.string({ minLength: 1, maxLength: 4 }),
            password: fc.string({ minLength: 1, maxLength: 7 }),
          }),
          data => {
            cy.findByLabelText(usernameLabel).type(data.username);
            cy.findByLabelText(passwordLabel).type(data.password);

            cy.findByRole('button', { name: submitButton }).click();
            cy.findByText(/Username.+(?:empty|too short)/);
            cy.findByText(/Password.+(?:empty|too short)/);

            cy.wrap(handleSubmit).should('not.have.been.called');
          },
        )
        .beforeEach(() => {
          handleSubmit.reset();
          mount(<LoginForm onSubmit={handleSubmit} />);
        }),
      { numRuns: 10 },
    );
  });

  it('should lock the form after three failed attempts', () => {
    const handleSubmit = cy.stub().throws(new Error('Wrong password'));

    mount(<LoginForm onSubmit={handleSubmit} />);

    cy.findByLabelText(usernameLabel).type(faker.internet.userName());
    cy.findByLabelText(passwordLabel).type(faker.internet.password());
    cy.findByRole('button', { name: submitButton }).click();
    cy.findByText(/Wrong password/);

    cy.findByLabelText(passwordLabel).clear().type(faker.internet.password());
    cy.findByRole('button', { name: submitButton }).click();

    cy.findByLabelText(passwordLabel).clear().type(faker.internet.password());
    cy.findByRole('button', { name: submitButton }).click();
    cy.findByRole('img', { name: 'sad face' }).should('be.visible');
    cy.findByText(/Too many failed attempts/);
  });
});
