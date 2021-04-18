import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ListTodo from 'components/todo/list-todo';
import React from 'react';
import { randomArrayElement } from 'utils/factories';
import { todoBuild } from 'utils/factories';

describe('<ListTodo />', () => {
  it('should render', () => {
    expect(
      render(
        <ListTodo todos={[]} onChangeTodo={jest.fn} onRemoveTodo={jest.fn} />,
      ),
    ).toBeDefined();
  });

  it('should list todos', () => {
    const spyChangeTodo = jest.fn();
    const spyRemoveTodo = jest.fn();
    const todos = Array.from({ length: 10 }, () =>
      todoBuild({ traits: 'old' }),
    );
    const todo = randomArrayElement(todos);

    render(
      <ListTodo
        todos={todos}
        onChangeTodo={spyChangeTodo}
        onRemoveTodo={spyRemoveTodo}
      />,
    );
    userEvent.click(
      screen
        .getByRole('listitem', { name: RegExp(todo.text) })
        .querySelector('input[type=checkbox]'),
    );

    expect(spyChangeTodo).toHaveBeenCalledWith(todo.id, { done: !todo.done });

    userEvent.click(
      screen.getByRole('button', { name: `Delete todo: ${todo.text}` }),
    );

    expect(spyRemoveTodo).toHaveBeenCalledWith(todo, expect.any(Number));
  });
});
