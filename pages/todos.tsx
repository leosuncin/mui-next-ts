import { Backdrop, CircularProgress, Collapse, Grid } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import withAuthentication, {
  AuthenticationProps,
} from 'components/hoc/with-authentication';
import Layout from 'components/layout';
import AddTodoForm from 'components/todo/add-todo';
import FilterTodo from 'components/todo/filter-todo';
import ListTodo from 'components/todo/list-todo';
import { useTodo } from 'hooks/use-todo';
import { NextPage } from 'next';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing(),
      margin: '0 auto',
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
  }),
);
const TodosPage: NextPage<AuthenticationProps> = () => {
  const classes = useStyles();
  const [state, actions] = useTodo();
  const display = {
    all: state.all,
    completed: state.completed,
    active: state.active,
  };

  return (
    <Layout title="Todo App">
      <Grid item sm={10} md={8} className={classes.root}>
        {Boolean(state.error) && (
          <Grid item>
            <Collapse in={Boolean(state.error)}>
              <Alert severity="error" role="alert">
                {state.error}
              </Alert>
            </Collapse>
          </Grid>
        )}
        <AddTodoForm onSubmit={todo => actions.addTodo(todo)} />
        <FilterTodo
          all={state.all.length}
          completed={state.completed.length}
          active={state.active.length}
          filter={state._filter}
          onChangeFilter={filter => actions.changeFilter(filter)}
          onClearCompleted={() =>
            state.completed.map(todo => actions.removeTodo(todo))
          }
        />
        <ListTodo
          todos={display[state._filter]}
          onChangeTodo={(id, body) => actions.updateTodo(id, body)}
          onRemoveTodo={(todo, position) => actions.removeTodo(todo, position)}
        />
        {state.loading && (
          <Backdrop open={state.loading} className={classes.backdrop}>
            <CircularProgress data-testid="loading-todos" />
          </Backdrop>
        )}
      </Grid>
    </Layout>
  );
};

export default withAuthentication(TodosPage);
