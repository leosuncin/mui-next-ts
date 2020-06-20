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
import { createTodo, deleteTodo, listTodo, updateTodo } from 'libs/api-client';
import { NextPage } from 'next';
import React, { useMemo } from 'react';
import { CreateTodo, TodoResponse as Todo, UpdateTodo } from 'types';
import { EffectReducer, useEffectReducer } from 'use-effect-reducer';

type TodoState = {
  loading: boolean;
  todos: Todo[];
  error?: string;
  _todo?: Todo;
  _position?: number;
  _filter: 'all' | 'completed' | 'active';
};
type TodoEvent =
  | {
      type: 'ERROR';
      payload: string;
    }
  | {
      type: 'FETCH_TODOS';
    }
  | {
      type: 'TODOS_FETCHED';
      payload: Todo[];
    }
  | {
      type: 'ADD_TODO';
      payload: CreateTodo;
    }
  | {
      type: 'TODO_SAVED';
      payload: Todo;
    }
  | {
      type: 'EDIT_TODO';
      payload: { id: string; body: UpdateTodo };
    }
  | {
      type: 'TODO_CHANGED';
      payload: Todo;
    }
  | {
      type: 'REMOVE_TODO';
      payload: { todo: Todo; position?: number };
    }
  | {
      type: 'REMOVE_TODO_FAILED';
      payload: string;
    }
  | {
      type: 'SWITCH_FILTER';
      payload: 'all' | 'completed' | 'active';
    };

type FetchTodosEffect = {
  type: 'fetchTodos';
};
type AddTodoEffect = {
  type: 'addTodo';
  payload: CreateTodo;
};
type EditTodoEffect = {
  type: 'editTodo';
  payload: { id: string; body: UpdateTodo };
};
type RemoveTodoEffect = {
  type: 'removeTodo';
  payload: string;
};
type TodoEffect =
  | FetchTodosEffect
  | AddTodoEffect
  | EditTodoEffect
  | RemoveTodoEffect;
const todoReducer: EffectReducer<TodoState, TodoEvent, TodoEffect> = (
  state,
  event,
  exec,
) => {
  switch (event.type) {
    case 'FETCH_TODOS':
      exec({ type: 'fetchTodos' });
      return {
        ...state,
        loading: true,
      };

    case 'TODOS_FETCHED':
      return {
        ...state,
        loading: false,
        todos: event.payload,
      };

    case 'ADD_TODO':
      exec({ type: 'addTodo', payload: event.payload });
      return {
        ...state,
        loading: true,
        error: undefined,
      };

    case 'TODO_SAVED':
      return {
        ...state,
        loading: false,
        todos: [event.payload, ...state.todos],
      };

    case 'EDIT_TODO':
      exec({ type: 'editTodo', payload: event.payload });
      return {
        ...state,
        error: undefined,
        todos: state.todos.map(todo =>
          todo.id === event.payload.id
            ? Object.assign(todo, event.payload.body, {
                updatedAt: new Date().toISOString(),
              })
            : todo,
        ),
      };

    case 'TODO_CHANGED':
      event.payload.updatedAt = new Date(event.payload.updatedAt).toISOString(); // Solves an issue
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === event.payload.id
            ? Object.assign(todo, event.payload)
            : todo,
        ),
      };

    case 'REMOVE_TODO':
      exec({ type: 'removeTodo', payload: event.payload.todo.id });
      return {
        ...state,
        error: undefined,
        todos: state.todos.filter(todo => todo.id !== event.payload.todo.id),
        _todo: event.payload.todo,
        _position:
          event.payload.position ??
          state.todos.findIndex(todo => todo.id === event.payload.todo.id),
      };

    case 'REMOVE_TODO_FAILED':
      return {
        ...state,
        error: event.payload,
        todos: state.todos.splice(state._position, 0, state._todo),
        _todo: undefined,
        _position: undefined,
      };

    case 'SWITCH_FILTER':
      return {
        ...state,
        _filter: event.payload,
      };

    case 'ERROR':
      return {
        ...state,
        error: event.payload,
      };

    default:
      return state;
  }
};
const initialState: TodoState = {
  todos: [],
  loading: true,
  _filter: 'all',
};
function fetchTodos(
  state: TodoState,
  effect: FetchTodosEffect,
  dispatch: React.Dispatch<TodoEvent>,
) {
  const ctrl = new AbortController();
  listTodo({ limit: 100, signal: ctrl.signal })
    .then(todos => dispatch({ type: 'TODOS_FETCHED', payload: todos }))
    .catch(error => dispatch({ type: 'ERROR', payload: error.message }));

  return () => ctrl.abort();
}
function addTodo(
  state: TodoState,
  effect: AddTodoEffect,
  dispatch: React.Dispatch<TodoEvent>,
) {
  createTodo(effect.payload)
    .then(todo => dispatch({ type: 'TODO_SAVED', payload: todo }))
    .catch(error => dispatch({ type: 'ERROR', payload: error.message }));
}
function editTodo(
  state: TodoState,
  effect: EditTodoEffect,
  dispatch: React.Dispatch<TodoEvent>,
) {
  updateTodo(effect.payload.id, effect.payload.body)
    .then(todo => dispatch({ type: 'TODO_CHANGED', payload: todo }))
    .catch(error => dispatch({ type: 'ERROR', payload: error.message }));
}
function removeTodo(
  state: TodoState,
  effect: RemoveTodoEffect,
  dispatch: React.Dispatch<TodoEvent>,
) {
  deleteTodo(effect.payload).catch(error =>
    dispatch({ type: 'REMOVE_TODO_FAILED', payload: error.message }),
  );
}
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
        <Grid item style={{ display: Boolean(state.error) ? 'block' : 'none' }}>
          <Collapse in={Boolean(state.error)}>
            <Alert severity="error">{state.error}</Alert>
          </Collapse>
        </Grid>
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
        <Backdrop open={state.loading} className={classes.backdrop}>
          <CircularProgress data-testid="loading-todos" />
        </Backdrop>
      </Grid>
    </Layout>
  );
};

export default withAuthentication(TodosPage);
