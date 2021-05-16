import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import React from 'react';

import { AuthProvider } from '@app/hooks/auth-context';
import { UserProvider } from '@app/hooks/user-context';
import { users } from '@app/libs/db/users';
import IndexPage from '@app/pages/index';
import server from '@app/utils/test-server';

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
