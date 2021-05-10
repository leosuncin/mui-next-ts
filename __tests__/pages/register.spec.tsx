import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from 'hooks/auth-context';
import { UserProvider } from 'hooks/user-context';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import type { NextRouter } from 'next/router';
import RegisterPage from 'pages/register';
import React from 'react';
import server from 'utils/test-server';

const routerMocked: jest.Mocked<NextRouter> = {
  pathname: '/register',
  route: '/register',
  query: {},
  asPath: '/register',
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

describe('<RegisterPage />', () => {
  const tree = (
    <RouterContext.Provider value={routerMocked}>
      <UserProvider>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </UserProvider>
    </RouterContext.Provider>
  );

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
    routerMocked.push.mockReset();
  });

  afterAll(() => server.close());

  it('should render', () => {
    expect(render(tree)).toBeDefined();
  });

  it('should shown the error for duplicate user', async () => {
    render(tree);

    userEvent.type(screen.getByLabelText(/First name/i), 'Jane');
    userEvent.type(screen.getByLabelText(/Last name/i), 'Doe');
    userEvent.type(screen.getByLabelText(/Username/i), 'jane_doe');
    userEvent.type(screen.getByLabelText(/Password/i), '!drowssap');
    userEvent.click(screen.getByText(/Sign Me Up/i));
    await waitForElementToBeRemoved(screen.getByTestId('registering-user'));

    await expect(
      screen.findByText('Username or Email already registered'),
    ).resolves.toBeInTheDocument();
  });

  it('should register a new user', async () => {
    render(tree);

    userEvent.type(screen.getByLabelText(/First name/i), 'Kristen');
    userEvent.type(screen.getByLabelText(/Last name/i), 'Williams');
    userEvent.type(screen.getByLabelText(/Username/i), 'kristen.williams');
    userEvent.type(screen.getByLabelText(/Password/i), 'Pa$$w0rd!');
    userEvent.click(screen.getByText(/Sign Me Up/i));
    await waitForElementToBeRemoved(screen.getByTestId('registering-user'));

    expect(routerMocked.push).toHaveBeenCalledTimes(1);
  });
});
