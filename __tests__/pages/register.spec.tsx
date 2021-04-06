import { render, waitForElementToBeRemoved } from '@testing-library/react';
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

  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    routerMocked.push.mockReset();
  });

  afterAll(() => {
    server.close();
  });

  it('should render', () => {
    expect(render(tree)).toBeDefined();
  });

  it('should shown the error for duplicate user', async () => {
    const { getByLabelText, getByText, findByText, getByTestId } = render(tree);

    userEvent.type(getByLabelText(/first name/i), 'Jane');
    userEvent.type(getByLabelText(/last name/i), 'Doe');
    userEvent.type(getByLabelText(/username/i), 'jane_doe');
    userEvent.type(getByLabelText(/password/i), '!drowssap');
    userEvent.click(getByText(/sign me up/i));
    await waitForElementToBeRemoved(getByTestId('registering-user'));

    await expect(
      findByText('Username or Email already registered'),
    ).resolves.toBeInTheDocument();
  });

  it('should register a new user', async () => {
    const { getByLabelText, getByText, getByTestId } = render(tree);

    userEvent.type(getByLabelText(/first name/i), 'Kristen');
    userEvent.type(getByLabelText(/last name/i), 'Williams');
    userEvent.type(getByLabelText(/username/i), 'kristen.williams');
    userEvent.type(getByLabelText(/password/i), 'Pa$$w0rd!');
    userEvent.click(getByText(/sign me up/i));
    await waitForElementToBeRemoved(getByTestId('registering-user'));

    expect(routerMocked.push).toHaveBeenCalledTimes(1);
  });
});
