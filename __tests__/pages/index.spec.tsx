import { fireEvent, render } from '@testing-library/react';
import React from 'react';

const spyRouterPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: spyRouterPush,
    };
  },
}));

import { UserProvider } from 'hooks/user-context';
import { AuthProvider } from 'hooks/auth-context';
import IndexPage from 'pages/index';

describe('<IndexPage />', () => {
  let tree;

  beforeEach(() => {
    const user = {
      id: '760add88-0a2b-4358-bc3f-7d82245c5dea',
      username: 'admin',
      name: 'Administrator',
      picture: 'https://i.pravatar.cc/200',
      bio: 'Lorem ipsum dolorem',
    };
    tree = (
      <UserProvider initialUser={user}>
        <AuthProvider>
          <IndexPage user={user} />
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

  it('should close the session', async () => {
    const { getByTestId, getByText } = render(tree);
    const profileMenu = getByTestId('profile-menu');
    const logoutItem = getByText('Logout');

    fireEvent.click(profileMenu);
    fireEvent.click(logoutItem);

    expect(logoutItem).not.toBeInTheDocument();
    expect(spyRouterPush).toHaveBeenCalled();
  });
});
