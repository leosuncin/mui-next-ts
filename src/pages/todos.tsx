import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { NextPage } from 'next';
import React from 'react';

import withAuthentication, {
  AuthenticationProps,
} from '@app/components/hoc/with-authentication';
import Layout from '@app/components/layout';
import Todo from '@app/components/todo';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(),
      margin: '0 auto',
    },
  }),
);

const TodosPage: NextPage<AuthenticationProps> = () => {
  const classes = useStyles();

  return (
    <Layout title="Todo App">
      <Todo className={classes.root} />
    </Layout>
  );
};

export default withAuthentication(TodosPage);
