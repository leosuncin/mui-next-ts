import { render, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from 'hooks/auth-context';
import { UserProvider } from 'hooks/user-context';
import RegisterPage from 'pages/register';
import React from 'react';
import server from 'utils/test-server';

const spyRouterPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: spyRouterPush,
    };
  },
}));

describe('<RegisterPage />', () => {
  const tree = (
    <UserProvider>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </UserProvider>
  );

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
    spyRouterPush.mockReset();
  });

  afterAll(() => server.close());

  it('should render', () => {
    expect(render(tree)).toBeDefined();
  });

  it('should shown the error for duplicate user', async () => {
    const { getByLabelText, getByText, findByText, getByTestId } = render(tree);

    await userEvent.type(getByLabelText(/First name/i), 'Jane');
    await userEvent.type(getByLabelText(/Last name/i), 'Doe');
    await userEvent.type(getByLabelText(/Username/i), 'jane_doe');
    await userEvent.type(getByLabelText(/Password/i), '!drowssap');
    userEvent.click(getByText(/Sign Me Up/i));
    await waitForElementToBeRemoved(getByTestId('registering-user'));

    await expect(
      findByText('Username or Email already registered'),
    ).resolves.toBeInTheDocument();
  });

  it('should register a new user', async () => {
    const { getByLabelText, getByText, getByTestId } = render(tree);

    await userEvent.type(getByLabelText(/First name/i), 'Kristen');
    await userEvent.type(getByLabelText(/Last name/i), 'Williams');
    await userEvent.type(getByLabelText(/Username/i), 'kristen.williams');
    await userEvent.type(getByLabelText(/Password/i), 'Pa$$w0rd!');
    userEvent.click(getByText(/Sign Me Up/i));
    await waitForElementToBeRemoved(getByTestId('registering-user'));

    expect(spyRouterPush).toHaveBeenCalledTimes(1);
  });
});
