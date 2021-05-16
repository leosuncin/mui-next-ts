import { filterTodoBy } from 'src/components/todo/filter-todo';
import {
  createTodo,
  deleteTodo,
  listTodo,
  updateTodo,
} from 'src/libs/api-client';
import { CreateTodo, TodoResponse as Todo, UpdateTodo } from 'src/types';
import { EffectReducer, useEffectReducer } from 'use-effect-reducer';

export type TodoState = {
  loading: boolean;
  saving?: boolean;
  all: Todo[];
  completed: Todo[];
  active: Todo[];
  error?: string;
  _todo?: Todo;
  _position?: number;
  _filter: keyof typeof filterTodoBy;
};

type TodoErrorEvent = { type: 'ERROR'; payload: string };
type TodoFetchEvent = { type: 'FETCH_TODOS' };
type TodoFetchSuccessEvent = { type: 'TODOS_FETCHED'; payload: Todo[] };
type TodoAddEvent = { type: 'ADD_TODO'; payload: CreateTodo };
type TodoAddSuccessEvent = { type: 'TODO_SAVED'; payload: Todo };
type TodoUpdateEvent = {
  type: 'EDIT_TODO';
  payload: { id: string; body: UpdateTodo };
};
type TodoUpdateSuccessEvent = { type: 'TODO_CHANGED'; payload: Todo };
type TodoUpdateFailEvent = { type: 'TODO_REVERT_CHANGE'; payload: string };
type TodoRemoveEvent = {
  type: 'REMOVE_TODO';
  payload: { todo: Todo; position?: number };
};
type TodoRemoveFailEvent = { type: 'REMOVE_TODO_FAILED'; payload: string };
type TodoChangeFilterEvent = {
  type: 'SWITCH_FILTER';
  payload: keyof typeof filterTodoBy;
};
export type TodoEvent =
  | TodoErrorEvent
  | TodoFetchEvent
  | TodoFetchSuccessEvent
  | TodoAddEvent
  | TodoAddSuccessEvent
  | TodoUpdateEvent
  | TodoUpdateSuccessEvent
  | TodoUpdateFailEvent
  | TodoRemoveEvent
  | TodoRemoveFailEvent
  | TodoChangeFilterEvent;

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
export type TodoEffect =
  | FetchTodosEffect
  | AddTodoEffect
  | EditTodoEffect
  | RemoveTodoEffect;

const defaultState: TodoState = {
  all: [],
  completed: [],
  active: [],
  loading: false,
  _filter: 'all',
};

const todoReducers: Record<
  TodoEvent['type'],
  EffectReducer<TodoState, TodoEvent, TodoEffect>
> = {
  FETCH_TODOS(state, _, exec) {
    exec({ type: 'fetchTodos' });

    return {
      ...state,
      loading: true,
    };
  },
  TODOS_FETCHED(state, event: TodoFetchSuccessEvent) {
    return {
      ...state,
      loading: false,
      all: event.payload,
      completed: completedSelector(event.payload),
      active: activeSelector(event.payload),
    };
  },
  ADD_TODO(state, { payload }: TodoAddEvent, exec) {
    exec({ type: 'addTodo', payload });

    return {
      ...state,
      loading: true,
      error: undefined,
    };
  },
  TODO_SAVED(state, { payload }: TodoAddSuccessEvent) {
    return {
      ...state,
      loading: false,
      all: [payload, ...state.all],
      active: [payload, ...state.active],
    };
  },
  EDIT_TODO(state, { payload }: TodoUpdateEvent, exec) {
    exec({ type: 'editTodo', payload });

    const _position = state.all.findIndex(todo => todo.id === payload.id);
    const all = state.all.map(todo =>
      todo.id === payload.id
        ? { ...todo, ...payload.body, updatedAt: new Date().toISOString() }
        : todo,
    );
    const completed = completedSelector(all);
    const active = activeSelector(all);

    return {
      ...state,
      saving: true,
      error: undefined,
      all,
      completed,
      active,
      _todo: state.all[_position],
      _position,
    };
  },
  TODO_CHANGED(state, { payload }: TodoUpdateSuccessEvent) {
    const all = state.all.map(todo =>
      todo.id === payload.id ? payload : todo,
    );

    return {
      ...state,
      saving: false,
      all,
      completed: payload.done ? completedSelector(all) : state.completed,
      active: !payload.done ? activeSelector(all) : state.active,
    };
  },
  TODO_REVERT_CHANGE(state, { payload: error }: TodoUpdateFailEvent) {
    const all = state.all.map(todo =>
      todo.id === state._todo.id ? state._todo : todo,
    );

    return {
      ...state,
      saving: false,
      error,
      all,
      active: activeSelector(all),
      completed: completedSelector(all),
      _todo: undefined,
      _position: undefined,
    };
  },
  REMOVE_TODO(state, { payload }: TodoRemoveEvent, exec) {
    exec({ type: 'removeTodo', payload: payload.todo.id });

    const all = state.all.filter(todo => todo.id !== payload.todo.id);
    const completed = payload.todo.done
      ? state.completed.filter(todo => todo.id !== payload.todo.id)
      : state.completed;
    const active = !payload.todo.done
      ? state.active.filter(todo => todo.id !== payload.todo.id)
      : state.active;
    const _position =
      payload.position ??
      state.all.findIndex(todo => todo.id === payload.todo.id);

    return {
      ...state,
      error: undefined,
      all,
      completed,
      active,
      _todo: payload.todo,
      _position,
    };
  },
  REMOVE_TODO_FAILED(state, { payload: error }: TodoRemoveFailEvent) {
    const all = [
      ...state.all.slice(0, state._position),
      state._todo,
      ...state.all.slice(state._position),
    ];
    const active = !state._todo.done
      ? [...state.active, state._todo].sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt),
        )
      : state.active;
    const completed = state._todo.done
      ? [...state.completed, state._todo].sort((a, b) =>
          a.createdAt.localeCompare(b.createdAt),
        )
      : state.completed;

    return {
      ...state,
      error,
      all,
      active,
      completed,
      _todo: undefined,
      _position: undefined,
    };
  },
  SWITCH_FILTER(state, { payload: _filter }: TodoChangeFilterEvent) {
    return {
      ...state,
      _filter,
    };
  },
  ERROR(state, { payload: error }: TodoErrorEvent) {
    return {
      ...state,
      loading: false,
      error,
    };
  },
};

export const todoReducer: EffectReducer<TodoState, TodoEvent, TodoEffect> = (
  state = defaultState,
  event,
  exec,
) =>
  event.type in todoReducers
    ? todoReducers[event.type](state, event, exec)
    : state;
const completedSelector = (todos: Todo[]) => todos.filter(todo => todo.done);
const activeSelector = (todos: Todo[]) => todos.filter(todo => !todo.done);

function errorAction(error: Error): TodoErrorEvent {
  return { type: 'ERROR', payload: error.message };
}
function fetchTodosAction(): FetchTodosEffect {
  return { type: 'fetchTodos' };
}
function fecthTodosSuccessAction(todos: Todo[]): TodoFetchSuccessEvent {
  return { type: 'TODOS_FETCHED', payload: todos };
}
function addTodoAction(newTodo: CreateTodo): TodoAddEvent {
  return { type: 'ADD_TODO', payload: newTodo };
}
function addTodoSuccessAction(todo: Todo): TodoAddSuccessEvent {
  return { type: 'TODO_SAVED', payload: todo };
}
function updateTodoAction(id: Todo['id'], body: UpdateTodo): TodoUpdateEvent {
  return {
    type: 'EDIT_TODO',
    payload: { id, body },
  };
}
function updateTodoSuccessAction(todo: Todo): TodoUpdateSuccessEvent {
  return { type: 'TODO_CHANGED', payload: todo };
}
function updateTodoFailAction(error: Error): TodoUpdateFailEvent {
  return { type: 'TODO_REVERT_CHANGE', payload: error.message };
}
function removeTodoAction(todo: Todo, position?: number): TodoRemoveEvent {
  return {
    type: 'REMOVE_TODO',
    payload: { todo, position },
  };
}
function removeTodoFailAction(error: Error): TodoRemoveFailEvent {
  return { type: 'REMOVE_TODO_FAILED', payload: error.message };
}
function changeFilterAction(
  filter: keyof typeof filterTodoBy,
): TodoChangeFilterEvent {
  return {
    type: 'SWITCH_FILTER',
    payload: filter,
  };
}

function fetchTodosEffect(
  state: TodoState,
  effect: FetchTodosEffect,
  dispatch: React.Dispatch<TodoEvent>,
) {
  const ctrl = new AbortController();
  listTodo({ signal: ctrl.signal })
    .then(todos => dispatch(fecthTodosSuccessAction(todos)))
    .catch(error => {
      if (!ctrl.signal.aborted) dispatch(errorAction(error));
    });

  return () => ctrl.abort();
}
function addTodoEffect(
  state: TodoState,
  effect: AddTodoEffect,
  dispatch: React.Dispatch<TodoEvent>,
) {
  const ctrl = new AbortController();
  createTodo(effect.payload, ctrl.signal)
    .then(todo => dispatch(addTodoSuccessAction(todo)))
    .catch(error => {
      if (!ctrl.signal.aborted) dispatch(errorAction(error));
    });

  return () => ctrl.abort();
}
function editTodoEffect(
  state: TodoState,
  effect: EditTodoEffect,
  dispatch: React.Dispatch<TodoEvent>,
) {
  const ctrl = new AbortController();
  updateTodo(effect.payload.id, effect.payload.body, ctrl.signal)
    .then(todo => dispatch(updateTodoSuccessAction(todo)))
    .catch(error => {
      if (!ctrl.signal.aborted) dispatch(updateTodoFailAction(error));
    });

  return () => ctrl.abort();
}
function removeTodoEffect(
  state: TodoState,
  effect: RemoveTodoEffect,
  dispatch: React.Dispatch<TodoEvent>,
) {
  const ctrl = new AbortController();
  deleteTodo(effect.payload, ctrl.signal).catch(error => {
    if (!ctrl.signal.aborted) dispatch(removeTodoFailAction(error));
  });

  return () => ctrl.abort();
}

type TodoAction = {
  addTodo(newTodo: CreateTodo): void;
  changeFilter(filter: keyof typeof filterTodoBy): void;
  removeTodo(todo: Todo, position?: number): void;
  updateTodo(id: Todo['id'], updates: UpdateTodo): void;
};

export function useTodo(): [TodoState, TodoAction] {
  const [state, dispatch] = useEffectReducer(
    todoReducer,
    exec => {
      exec(fetchTodosAction());

      return { ...defaultState, loading: true };
    },
    {
      fetchTodos: fetchTodosEffect,
      addTodo: addTodoEffect,
      editTodo: editTodoEffect,
      removeTodo: removeTodoEffect,
    },
  );

  return [
    state,
    {
      addTodo(newTodo) {
        dispatch(addTodoAction(newTodo));
      },
      changeFilter(filter) {
        dispatch(changeFilterAction(filter));
      },
      removeTodo(todo) {
        dispatch(removeTodoAction(todo));
      },
      updateTodo(id, updates) {
        dispatch(updateTodoAction(id, updates));
      },
    },
  ];
}
