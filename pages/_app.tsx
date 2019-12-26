import CssBaseline from '@material-ui/core/CssBaseline';
import App from 'next/app';
import Head from 'next/head';
import React from 'react';

import { AuthProvider } from 'hooks/auth-context';
import { UserProvider } from 'hooks/user-context';

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>MUI + Next.js</title>
        </Head>
        <UserProvider>
          <AuthProvider>
            <CssBaseline />
            <Component {...pageProps} />
          </AuthProvider>
        </UserProvider>
      </>
    );
  }
}

export default MyApp;
