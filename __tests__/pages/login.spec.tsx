import { RenderResult, act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createModel } from '@xstate/test';
import { AuthProvider } from 'hooks/auth-context';
import { UserProvider } from 'hooks/user-context';
import fetchMock from 'jest-fetch-mock';
import createMachineWithTests, { FillEvent } from 'machines/login-test-machine';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import type { NextRouter } from 'next/router';
import LoginPage from 'pages/login';
import React from 'react';

const routerMocked: jest.Mocked<NextRouter> = {
  pathname: '/login',
  route: '/login',
  query: {},
  asPath: '/login',
  isFallback: false,
  basePath: '',
  events: { emit: jest.fn(), off: jest.fn(), on: jest.fn() },
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn().mockResolvedValue(undefined),
  beforePopState: jest.fn(),
};
fetchMock.enableMocks();

const formTitle = 'login form';
const usernameLabel = /Username/i;
const passwordLabel = /Password/i;
const submitButton = /Log me in/i;
const usernameErrorMessage = /Username.+(?:empty|too short)/i;
const passwordErrorMessage = /Password.+(?:empty|too short)/i;
const credentialsErrorMessage = /Wrong (?:username|password)/i;
const invalidErrorMessages = /(?:Username|Password).+(?:empty|too short)/i;
const lockedErrorMessage = /Too many failed attempts/i;

const testMachine = createMachineWithTests({
  pristine: ({ getByLabelText }: RenderResult) => {
    expect(getByLabelText('sad face').parentElement).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  },
  invalid: async ({ findAllByText }: RenderResult) => {
    const errorMessages = await findAllByText(invalidErrorMessages);

    expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    expect(errorMessages.length).toBeLessThan(3);
  },
  'invalid.username': async ({ findByText }: RenderResult) => {
    await expect(findByText(usernameErrorMessage)).resolves.toBeInTheDocument();
  },
  'invalid.password': async ({ findByText }: RenderResult) => {
    await expect(findByText(passwordErrorMessage)).resolves.toBeInTheDocument();
  },
  valid: ({ queryAllByText }: RenderResult) => {
    expect(queryAllByText(usernameErrorMessage)).toHaveLength(0);
  },
  correctCredentials: ({ getByLabelText }: RenderResult) => {
    expect(getByLabelText(usernameLabel)).toBeValid();
    expect(getByLabelText(passwordLabel)).toBeValid();
  },
  incorrectCredentials: ({ getByText }: RenderResult) => {
    expect(getByText(credentialsErrorMessage)).toBeInTheDocument();
  },
  success: () => {
    expect(routerMocked.push).toHaveBeenCalledTimes(1);
  },
  retry: ({ getByText }: RenderResult) => {
    expect(getByText(submitButton).parentElement).toBeEnabled();
  },
  locked: ({ getByLabelText, getByText }: RenderResult) => {
    expect(getByText(lockedErrorMessage)).toBeInTheDocument();
    expect(getByLabelText(usernameLabel)).toBeDisabled();
    expect(getByLabelText(passwordLabel)).toBeDisabled();
    expect(getByText(submitButton).parentElement).toBeDisabled();
  },
});
const testModel = createModel(testMachine, {
  events: {
    FILL_FORM: {
      async exec({ getByLabelText }: RenderResult, event: FillEvent) {
        const usernameInput = getByLabelText(usernameLabel) as HTMLInputElement;
        const passwordInput = getByLabelText(passwordLabel) as HTMLInputElement;

        usernameInput.value = '';
        passwordInput.value = '';

        await act(async () => {
          await userEvent.type(usernameInput, event.username);
          fireEvent.blur(usernameInput);

          await userEvent.type(passwordInput, event.password);
          fireEvent.blur(passwordInput);
        });

        // Mock the respond by the payload
        if (event.username === 'admin' && event.password === 'Pa$$w0rd!') {
          fetchMock.mockResponse(`{
            "id": "760add88-0a2b-4358-bc3f-7d82245c5dea",
            "username": "admin",
            "name": "Administrator",
            "picture": "https://i.pravatar.cc/200",
            "bio": "Lorem ipsum dolorem"
          }`);
        } else {
          fetchMock.mockResponse(
            JSON.stringify({
              statusCode: 401,
              error: 'Unauthorized',
              message:
                event.username !== 'admin'
                  ? `Wrong username: ${event.username}`
                  : `"Wrong password for user: ${event.username}`,
            }),
            {
              status: 401,
            },
          );
        }
      },
      cases: [
        // Invalid user
        { username: 'user', password: 'ji32k7au4a83' },
        // Invalid password
        { username: 'anonymous', password: 'qwerty' },
        // Wrong password
        { username: 'admin', password: '$0rdiDHUm4n8/95' },
        // Wrong username
        { username: 'administrator', password: ")miLNZWw43')Uvc1F{" },
        // Correct credentials
        { username: 'admin', password: 'Pa$$w0rd!' },
      ],
    },
    SUBMIT({ getByTitle }: RenderResult) {
      return act(async () => {
        fireEvent.submit(getByTitle(formTitle));
      });
    },
    RETRY(cy: RenderResult) {
      return act(async () => {
        const passwordInput = cy.getByLabelText(
          passwordLabel,
        ) as HTMLInputElement;

        userEvent.type(passwordInput, '-l}AIlZx&gEB');
        fireEvent.submit(cy.getByTitle(formTitle));

        userEvent.type(passwordInput, 'Id"Dqe!um3Z&h}~h\',%*=hlm');
      });
    },
  },
});
const testPlans = testModel.getSimplePathPlans();

testPlans.forEach(plan => {
  describe(`Login page ${plan.description}`, () => {
    afterEach(() => {
      routerMocked.push.mockReset();
      fetchMock.resetMocks();
    });

    plan.paths.forEach(path => {
      // eslint-disable-next-line jest/expect-expect, jest/valid-title
      it(path.description, () => {
        return path.test(
          render(
            <RouterContext.Provider value={routerMocked}>
              <UserProvider>
                <AuthProvider>
                  <LoginPage />
                </AuthProvider>
              </UserProvider>
            </RouterContext.Provider>,
          ),
        );
      });
    });
  });
});

// eslint-disable-next-line jest/expect-expect
it('states coverage', () => {
  testModel.testCoverage();
});
