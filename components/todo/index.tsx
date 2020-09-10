import { Backdrop, CircularProgress, Collapse, Grid } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import { useTodo } from 'hooks/use-todo';
import React from 'react';

import AddTodoForm from './add-todo';
import FilterTodo from './filter-todo';
import ListTodo from './list-todo';

type TodoProps = {
  className?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
    },
  }),
);

function Todo({ className }: TodoProps) {
  const classes = useStyles();
  const [state, actions] = useTodo();

  return (
    <Grid item sm={10} md={8} className={className}>
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
        todos={state[state._filter]}
        onChangeTodo={(id, body) => actions.updateTodo(id, body)}
        onRemoveTodo={(todo, position) => actions.removeTodo(todo, position)}
      />
      {state.loading && (
        <Backdrop open={state.loading} className={classes.backdrop}>
          <CircularProgress data-testid="loading-todos" />
        </Backdrop>
      )}
    </Grid>
  );
}
Todo.propTypes = {};

export default Todo;
