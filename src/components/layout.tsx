import Container from '@material-ui/core/Container';
import Head from 'next/head';
import React from 'react';

import Header from '@app/components/header';

export interface LayoutProps {
  title?: string;
}

function Layout(props: React.PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Head>
        <title>{props.title ?? 'Main page'}</title>
      </Head>
      <Header title={props.title ?? 'Main page'} />
      <Container maxWidth="md">{props.children}</Container>
    </>
  );
}

export default Layout;
