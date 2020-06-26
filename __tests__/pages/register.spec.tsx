import { act, fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from 'hooks/auth-context';
import { UserProvider } from 'hooks/user-context';
import fetchMock from 'jest-fetch-mock';
import RegisterPage from 'pages/register';
import React from 'react';

const spyRouterPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: spyRouterPush,
    };
  },
}));
fetchMock.enableMocks();

describe('<RegisterPage />', () => {
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
    const { getByLabelText, getByTitle, findByText } = render(tree);

    userEvent.type(getByLabelText(/First name/i), 'Jane');
    userEvent.type(getByLabelText(/Last name/i), 'Doe');
    userEvent.type(getByLabelText(/Username/i), 'jane_doe');
    userEvent.type(getByLabelText(/Password/i), '!drowssap');

    await act(async () => {
      fireEvent.submit(getByTitle('register form'));
    });

    await expect(
      findByText('Username or Email already registered'),
    ).resolves.toBeInTheDocument();
  });

  it('should register a new user', async () => {
    fetchMock.mockResponse(`{
      "id": "760add88-0a2b-4358-bc3f-7d82245c5dea",
      "username": "kristen.williams",
      "firstName": "Williams",
      "lastName": "Williams",
      "picture": "https://i.pravatar.cc/200",
      "bio": "Lorem ipsum dolorem"
    }`);
    const { getByLabelText, getByTitle } = render(tree);

    userEvent.type(getByLabelText(/First name/i), 'Kristen');
    userEvent.type(getByLabelText(/Last name/i), 'Williams');
    userEvent.type(getByLabelText(/Username/i), 'kristen.williams');
    userEvent.type(getByLabelText(/Password/i), 'Pa$$w0rd!');

    await act(async () => {
      fireEvent.submit(getByTitle('register form'));
    });

    expect(spyRouterPush).toHaveBeenCalledTimes(1);
  });
});
