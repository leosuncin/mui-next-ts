import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';
import { AuthProvider } from 'src/hooks/auth-context';
import { UserProvider } from 'src/hooks/user-context';
import { users } from 'src/libs/db/users';
import IndexPage from 'src/pages/index';
import server from 'src/utils/test-server';

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
    render(tree);
    const profileMenu = screen.getByTestId('profile-menu');
    const logoutItem = screen.getByText('Logout');

    fireEvent.click(profileMenu);
    fireEvent.click(logoutItem);
    await waitForElementToBeRemoved(logoutItem);

    expect(logoutItem).not.toBeInTheDocument();
    expect(spyRouterPush).toHaveBeenCalled();
  });
});
