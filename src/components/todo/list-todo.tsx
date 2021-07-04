import { Grid, LinearProgress, List } from '@material-ui/core';
import React from 'react';

import { TodoResponse as Todo, UpdateTodo } from '@app/types';

import TodoItem from './todo-item';

export interface ListTodoProps {
  todos: Todo[];
  saving?: boolean;
  onChangeTodo: (id: string, body: UpdateTodo) => void;
  onRemoveTodo: (todo: Todo, position?: number) => void;
}

function ListTodo(props: ListTodoProps) {
  return (
    <Grid item>
      {props.saving ? (
        <LinearProgress variant="indeterminate" data-testid="saving-todos" />
      ) : null}
      <List aria-label="List of todo">
        {props.todos.map((todo, idx) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onChangeTodo={body => props.onChangeTodo(todo.id, body)}
            onRemoveTodo={props.onRemoveTodo.bind(null, todo, idx)}
          />
        ))}
      </List>
    </Grid>
  );
}

export default ListTodo;
