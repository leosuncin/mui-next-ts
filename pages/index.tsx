import { Grid } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';

import withAuthentication, {
  AuthenticationProps,
} from 'components/hoc/with-authentication';
import UserCard from 'components/cards/user';
import Layout from 'components/layout';

const IndexPage: NextPage<AuthenticationProps> = props => (
  <Layout>
    <Grid
      container
      spacing={2}
      justify="center"
      alignItems="center"
      style={{ paddingTop: '2em' }}
    >
      <Grid item>
        <UserCard {...props.user} />
      </Grid>
    </Grid>
  </Layout>
);

export default withAuthentication(IndexPage);
