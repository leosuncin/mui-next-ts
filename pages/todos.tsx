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
import {
  addTodo,
  editTodo,
  fetchTodos,
  initialState,
  removeTodo,
  todoReducer,
} from 'hooks/todo-effect-reducer';
import { NextPage } from 'next';
import React, { useMemo } from 'react';
import { useEffectReducer } from 'use-effect-reducer';

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
  const [state, dispatch] = useEffectReducer(
    todoReducer,
    exec => {
      exec({ type: 'fetchTodos' });
      return initialState;
    },
    {
      fetchTodos,
      addTodo,
      editTodo,
      removeTodo,
    },
  );
  const completed = useMemo(() => state.todos.filter(todo => todo.done), [
    state,
  ]);
  const active = useMemo(() => state.todos.filter(todo => !todo.done), [state]);
  const display = {
    all: state.todos,
    completed,
    active,
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
        <AddTodoForm
          onSubmit={todo => dispatch({ type: 'ADD_TODO', payload: todo })}
        />
        <FilterTodo
          all={state.todos.length}
          completed={completed.length}
          active={active.length}
          filter={state._filter}
          onChangeFilter={filter =>
            dispatch({ type: 'SWITCH_FILTER', payload: filter })
          }
          onClearCompleted={() =>
            completed.map(todo =>
              dispatch({ type: 'REMOVE_TODO', payload: { todo } }),
            )
          }
        />
        <ListTodo
          todos={display[state._filter]}
          onChangeTodo={(id, body) =>
            dispatch({ type: 'EDIT_TODO', payload: { id, body } })
          }
          onRemoveTodo={(todo, position) =>
            dispatch({ type: 'REMOVE_TODO', payload: { todo, position } })
          }
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
