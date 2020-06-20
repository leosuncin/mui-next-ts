import { Grid, List } from '@material-ui/core';
import React from 'react';
import { TodoResponse as Todo, UpdateTodo } from 'types';

import TodoItem from './todo-item';

const ListTodo: React.FC<{
  todos: Todo[];
  onChangeTodo: (id: string, body: UpdateTodo) => void;
  onRemoveTodo: (todo: Todo, position) => void;
}> = props => (
  <Grid item>
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

export default ListTodo;
