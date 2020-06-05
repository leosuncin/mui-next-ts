import { act, fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from 'hooks/auth-context';
import { UserProvider } from 'hooks/user-context';
import LoginPage from 'pages/login';
import React from 'react';

const spyRouterPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: spyRouterPush,
    };
  },
}));

describe('<loginPage />', () => {
  /* global fetchMock */
  let tree;

  beforeEach(() => {
    tree = (
      <UserProvider>
        <AuthProvider>
          <LoginPage />
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

  it('should show an error for wrong username', async () => {
    fetchMock.mockResponse(
      `{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "There isn't any user with username: nobody"
}`,
      { status: 401 },
    );
    const { getByLabelText, getByTitle, getByText } = render(tree);

    userEvent.type(getByLabelText(/Username/), 'nobody');
    userEvent.type(getByLabelText(/Password/), 'Pa$$w0rd!');
    await act(async () => {
      fireEvent.submit(getByTitle('login form'));
    });

    const errorMessage = await waitFor(() =>
      getByText(/any user with username/i),
    );
    expect(errorMessage).toBeVisible();
  });

  it('should show an error for wrong password', async () => {
    fetchMock.mockResponse(
      `{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Wrong password for user with username: admin"
}`,
      { status: 401 },
    );
    const { getByLabelText, getByTitle, getByText } = render(tree);

    userEvent.type(getByLabelText(/Username/), 'admin');
    userEvent.type(getByLabelText(/Password/), 'ji32k7au4a83');
    await act(async () => {
      fireEvent.submit(getByTitle('login form'));
    });

    const errorMessage = await waitFor(() => getByText(/Wrong password/i));
    expect(errorMessage).toBeVisible();
  });

  it('should login the user', async () => {
    fetchMock.mockResponseOnce(`{
  "id": "760add88-0a2b-4358-bc3f-7d82245c5dea",
  "username": "admin",
  "name": "Administrator",
  "picture": "https://i.pravatar.cc/200",
  "bio": "Lorem ipsum dolorem"
}`);
    const { getByLabelText, getByTitle } = render(tree);

    userEvent.type(getByLabelText(/Username/), 'admin');
    userEvent.type(getByLabelText(/Password/), 'Pa$$w0rd!');
    await act(async () => {
      fireEvent.submit(getByTitle('login form'));
    });

    expect(spyRouterPush).toHaveBeenCalledTimes(1);
  });
});
