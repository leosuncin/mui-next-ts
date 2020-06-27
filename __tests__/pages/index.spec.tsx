import {
  fireEvent,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { AuthProvider } from 'hooks/auth-context';
import { UserProvider } from 'hooks/user-context';
import { users } from 'libs/db/users';
import IndexPage from 'pages/index';
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

describe('<IndexPage />', () => {
  const tree = (
    <UserProvider initialUser={users[0]}>
      <AuthProvider>
        <IndexPage user={users[0]} />
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

  it('should close the session', async () => {
    const { getByTestId, getByText } = render(tree);
    const profileMenu = getByTestId('profile-menu');
    const logoutItem = getByText('Logout');

    fireEvent.click(profileMenu);
    fireEvent.click(logoutItem);
    await waitForElementToBeRemoved(logoutItem);

    expect(logoutItem).not.toBeInTheDocument();
    expect(spyRouterPush).toHaveBeenCalled();
  });
});
