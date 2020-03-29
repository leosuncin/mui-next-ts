import { act, fireEvent, render, waitForElement } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

const spyRouterPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: spyRouterPush,
    };
  },
}));

import RegisterPage from 'pages/register';
import { UserProvider } from 'hooks/user-context';
import { AuthProvider } from 'hooks/auth-context';

describe('<RegisterPage />', () => {
  /* global fetchMock */
  let tree;

  beforeEach(() => {
    tree = (
      <UserProvider>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </UserProvider>
    );
  });

  afterEach(() => {
    spyRouterPush.mockReset();
  });

  it('should render', () => {
    expect(render(tree)).toBeDefined();
  });

  it('should shown the error for duplicate user', async () => {
    fetchMock.mockResponse(
      `{
      "statusCode": 409,
      "error": "Conflict",
      "message": "Username or Email already registered"
    }`,
      { status: 409 },
    );
    const { getByLabelText, getByTitle, getByText } = render(tree);

    userEvent.type(getByLabelText(/First name/i), 'Jane');
    userEvent.type(getByLabelText(/Last name/i), 'Doe');
    userEvent.type(getByLabelText(/Email/i), 'jane@doe.me');
    userEvent.type(getByLabelText(/Password/i), '!drowssap');

    await act(async () => {
      fireEvent.submit(getByTitle('register form'));
    });

    await expect(
      waitForElement(() => getByText('Username or Email already registered')),
    ).resolves.toBeInTheDocument();
  });

  it('should register a new user', async () => {
    fetchMock.mockResponse(`{
      "id": "760add88-0a2b-4358-bc3f-7d82245c5dea",
      "username": "kristen.williams@example.com",
      "name": "Kristen Williams",
      "picture": "https://i.pravatar.cc/200",
      "bio": "Lorem ipsum dolorem"
    }`);
    const { getByLabelText, getByTitle } = render(tree);

    userEvent.type(getByLabelText(/First name/i), 'Kristen');
    userEvent.type(getByLabelText(/Last name/i), 'Williams');
    userEvent.type(getByLabelText(/Email/i), 'kristen.williams@example.com');
    userEvent.type(getByLabelText(/Password/i), 'Pa$$w0rd!');

    await act(async () => {
      fireEvent.submit(getByTitle('register form'));
    });

    expect(spyRouterPush).toHaveBeenCalledTimes(1);
  });
});
