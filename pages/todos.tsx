import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import withAuthentication, {
  AuthenticationProps,
} from 'components/hoc/with-authentication';
import Layout from 'components/layout';
import Todo from 'components/todo';
import { NextPage } from 'next';
import React from 'react';

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
