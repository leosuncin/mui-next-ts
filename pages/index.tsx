import Typography from '@material-ui/core/Typography';
import { NextPage } from 'next';
import React from 'react';

import withAuthentication, {
  AuthenticationProps,
} from 'components/hoc/with-authentication';

const IndexPage: NextPage<AuthenticationProps> = props => (
  <Typography variant="h1">Hello World</Typography>
);

export default withAuthentication(IndexPage);
