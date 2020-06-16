import { NextPage } from 'next';
import Router from 'next/router';
import { parseCookies } from 'nookies';
import React, { useEffect } from 'react';
import { UserWithoutPassword as User } from 'types';

export type AuthenticationProps = {
  user: User;
};
function parseUser(sessionUser: string) {
  if (typeof sessionUser !== 'string') return false;

  try {
    return JSON.parse(sessionUser);
  } catch {
    return false;
  }
}
const withAuthentication = (WrappedPage: NextPage) => {
  const Wrapper: NextPage<AuthenticationProps> = props => {
    useEffect(() => {
      const syncLogout = event => {
        if (event.key === 'logoutAt') {
          Router.push('/login');
        }
      };

      window.addEventListener('storage', syncLogout);

      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logoutAt');
      };
    }, []);

    return <WrappedPage {...props} />;
  };

  Wrapper.getInitialProps = async ctx => {
    const { token, sessionUser } = parseCookies(ctx);
    const user = parseUser(sessionUser);

    if (!token || !user) {
      if (process.browser) {
        Router.push('/login');
      } else {
        ctx.res.writeHead(302, { Location: '/login' });
        ctx.res.end();
      }
    }

    const componentProps =
      WrappedPage.getInitialProps && (await WrappedPage.getInitialProps(ctx));

    return { ...componentProps, user };
  };

  return Wrapper;
};

export default withAuthentication;
