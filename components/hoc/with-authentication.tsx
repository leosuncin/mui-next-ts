import { NextPage, NextPageContext } from 'next';
import nextCookie from 'next-cookies';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { UserWithoutPassword as User } from 'types';

export type AuthenticationProps = {
  user: User;
};

const authentication = (ctx: NextPageContext): User => {
  const { sessionUser } = nextCookie(ctx);

  if (!sessionUser) {
    if (process.browser) Router.push('/login');
    else {
      ctx.res.writeHead(302, { Location: '/login' });
      ctx.res.end();
    }
  } else return (sessionUser as unknown) as User;
};
const withAuthentication = (WrappedPage: NextPage) => {
  const Wrapper: NextPage<{ user?: User }> = props => {
    const syncLogout = event => {
      if (event.key === 'logoutAt') {
        Router.push('/login');
      }
    };

    useEffect(() => {
      window.addEventListener('storage', syncLogout);

      return () => {
        window.removeEventListener('storage', syncLogout);
        window.localStorage.removeItem('logoutAt');
      };
    }, []);

    return <WrappedPage {...props} />;
  };

  Wrapper.getInitialProps = async ctx => {
    const user = authentication(ctx);

    const componentProps =
      WrappedPage.getInitialProps && (await WrappedPage.getInitialProps(ctx));

    return { ...componentProps, user };
  };

  return Wrapper;
};

export default withAuthentication;
