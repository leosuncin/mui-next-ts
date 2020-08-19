import { createTodo, deleteTodo, listTodo, updateTodo } from 'libs/api-client';
import { CreateTodo, TodoResponse as Todo, UpdateTodo } from 'types';
import { EffectReducer } from 'use-effect-reducer';

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

export const todoReducer: EffectReducer<TodoState, TodoEvent, TodoEffect> = (
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
        loading: false,
        error: event.payload,
      };

    default:
      return state;
  }
};

export const initialState: TodoState = {
  todos: [],
  loading: true,
  _filter: 'all',
};

export function fetchTodos(
  state: TodoState,
  effect: FetchTodosEffect,
  dispatch: React.Dispatch<TodoEvent>,
) {
  const ctrl = new AbortController();
  listTodo({ signal: ctrl.signal })
    .then(todos => dispatch({ type: 'TODOS_FETCHED', payload: todos }))
    .catch(
      error =>
        ctrl.signal.aborted ||
        dispatch({ type: 'ERROR', payload: error.message }),
    );

  return () => ctrl.abort();
}

export function addTodo(
  state: TodoState,
  effect: AddTodoEffect,
  dispatch: React.Dispatch<TodoEvent>,
) {
  createTodo(effect.payload)
    .then(todo => dispatch({ type: 'TODO_SAVED', payload: todo }))
    .catch(error => dispatch({ type: 'ERROR', payload: error.message }));
}

export function editTodo(
  state: TodoState,
  effect: EditTodoEffect,
  dispatch: React.Dispatch<TodoEvent>,
) {
  updateTodo(effect.payload.id, effect.payload.body)
    .then(todo => dispatch({ type: 'TODO_CHANGED', payload: todo }))
    .catch(error => dispatch({ type: 'ERROR', payload: error.message }));
}

export function removeTodo(
  state: TodoState,
  effect: RemoveTodoEffect,
  dispatch: React.Dispatch<TodoEvent>,
) {
  deleteTodo(effect.payload).catch(error =>
    dispatch({ type: 'REMOVE_TODO_FAILED', payload: error.message }),
  );
}
