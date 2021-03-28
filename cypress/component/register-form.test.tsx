import RegisterForm from 'components/forms/register';
import { mount } from 'cypress-react-unit-test';
import fc from 'fast-check';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import type { NextRouter } from 'next/router';
import React from 'react';
import { registerBuild } from 'utils/factories';

describe('RegisterForm component', () => {
  const firstNameLabel = /First name/i;
  const lastNameLabel = /Last name/i;
  const usernameLabel = /Username/i;
  const passwordLabel = /Password/i;
  const submitButton = /Sign Me Up/i;
  const Component = ({ onSubmit }) => {
    const router: NextRouter = {
      pathname: '/register',
      route: '/register',
      query: {},
      asPath: '/register',
      isFallback: false,
      basePath: '',
      events: { emit: cy.spy(), off: cy.spy(), on: cy.spy() },
      push: cy.spy(),
      replace: cy.spy(),
      reload: cy.spy(),
      back: cy.spy(),
      prefetch: cy.stub().resolves(),
      beforePopState: cy.spy(),
      isReady: true,
      isPreview: false,
      isLocaleDomain: true,
    };

    return (
      <RouterContext.Provider value={router}>
        <RegisterForm onSubmit={onSubmit} />
      </RouterContext.Provider>
    );
  };

  it('should submit the form', () => {
    const data = registerBuild();
    const spySubmit = cy.stub().as('handleSubmit');

    mount(<Component onSubmit={spySubmit} />);
    cy.findByLabelText(firstNameLabel).type(data.firstName);
    cy.findByLabelText(lastNameLabel).type(data.lastName);
    cy.findByLabelText(usernameLabel).type(data.username);
    cy.findByLabelText(passwordLabel).type(data.password);
    cy.findByRole('button', { name: submitButton }).click();

    cy.get('@handleSubmit').should('have.been.calledWith', data);
  });

  it('should validate the form', () => {
    const spySubmit = cy.stub();

    fc.assert(
      fc
        .property(
          fc.record({
            firstName: fc.char(),
            lastName: fc.char(),
            username: fc.string({ minLength: 1, maxLength: 4 }),
            password: fc.string({ minLength: 1, maxLength: 7 }),
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

            cy.wrap(spySubmit).should('not.have.been.called');
          },
        )
        .beforeEach(() => {
          spySubmit.reset();
          mount(<Component onSubmit={spySubmit} />);
        }),
      { numRuns: 10 },
    );
  });
});
