import {
  RenderResult,
  act,
  fireEvent,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createModel } from '@xstate/test';
import fetchMock from 'jest-fetch-mock';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import type { NextRouter } from 'next/router';
import React from 'react';

import { AuthProvider } from '@app/hooks/auth-context';
import { UserProvider } from '@app/hooks/user-context';
import createMachineWithTests, {
  FillEvent,
} from '@app/machines/login-test-machine';
import LoginPage from '@app/pages/login';

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
  isReady: true,
  isPreview: false,
  isLocaleDomain: true,
};
fetchMock.enableMocks();

const usernameLabel = /Username/i;
const passwordLabel = /Password/i;
const submitButton = /Log me in/i;
const usernameErrorMessage = /Username.+(?:empty|too short)/i;
const passwordErrorMessage = /Password.+(?:empty|too short)/i;
const credentialsErrorMessage = /Wrong (?:username|password)/i;
const invalidErrorMessages = /(?:Username|Password).+(?:empty|too short)/i;
const lockedErrorMessage = /Too many failed attempts/i;

const testMachine = createMachineWithTests({
  pristine: (screen: RenderResult) => {
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  },
  invalid: async (screen: RenderResult) => {
    const errorMessages = await screen.findAllByText(invalidErrorMessages);

    expect(errorMessages.length).toBeGreaterThanOrEqual(1);
    expect(errorMessages.length).toBeLessThan(3);
  },
  'invalid.username': async (screen: RenderResult) => {
    await expect(
      screen.findByText(usernameErrorMessage),
    ).resolves.toBeInTheDocument();
  },
  'invalid.password': async (screen: RenderResult) => {
    await expect(
      screen.findByText(passwordErrorMessage),
    ).resolves.toBeInTheDocument();
  },
  valid: (screen: RenderResult) => {
    expect(screen.queryAllByText(usernameErrorMessage)).toHaveLength(0);
  },
  correctCredentials: (screen: RenderResult) => {
    expect(screen.getByLabelText(usernameLabel)).toBeValid();
    expect(screen.getByLabelText(passwordLabel)).toBeValid();
  },
  incorrectCredentials: (screen: RenderResult) => {
    expect(screen.getByText(credentialsErrorMessage)).toBeInTheDocument();
  },
  success: () => {
    expect(routerMocked.push).toHaveBeenCalledTimes(1);
  },
  retry: (screen: RenderResult) => {
    expect(screen.getByRole('button', { name: submitButton })).toBeEnabled();
  },
  locked: (screen: RenderResult) => {
    expect(screen.getByRole('alert')).toHaveTextContent(lockedErrorMessage);
    expect(screen.getByLabelText(usernameLabel)).toBeDisabled();
    expect(screen.getByLabelText(passwordLabel)).toBeDisabled();
    expect(screen.getByRole('button', { name: submitButton })).toBeDisabled();
  },
});
const testModel = createModel(testMachine, {
  events: {
    FILL_FORM: {
      async exec(screen: RenderResult, event: FillEvent) {
        const usernameInput = screen.getByLabelText(
          usernameLabel,
        ) as HTMLInputElement;
        const passwordInput = screen.getByLabelText(
          passwordLabel,
        ) as HTMLInputElement;

        await act(async () => {
          userEvent.clear(usernameInput);
          userEvent.type(usernameInput, event.username);
          fireEvent.blur(usernameInput);

          userEvent.clear(passwordInput);
          userEvent.type(passwordInput, event.password);
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
        { username: 'administrator', password: ")miLNZWw43')Uvc1F" },
        // Correct credentials
        { username: 'admin', password: 'Pa$$w0rd!' },
      ],
    },
    async SUBMIT(screen: RenderResult) {
      userEvent.click(screen.getByRole('button', { name: submitButton }));
      await screen.findByRole('progressbar');
    },
    async RETRY(screen: RenderResult) {
      const passwordInput = screen.getByLabelText(
        passwordLabel,
      ) as HTMLInputElement;

      userEvent.type(passwordInput, '-l}AIlZx&gEB');
      userEvent.click(screen.getByRole('button', { name: submitButton }));
      await waitForElementToBeRemoved(screen.getByRole('progressbar'));

      userEvent.type(passwordInput, 'Id"Dqe!um3Z&h}~h\',%*=hlm');
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
