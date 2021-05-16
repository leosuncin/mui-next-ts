import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import TodoItem from 'src/components/todo/todo-item';
import { todoBuild } from 'src/utils/factories';

describe('<TodoItem />', () => {
  it('should render', () => {
    const todo = todoBuild();

    expect(
      render(
        <TodoItem
          todo={todo}
          onChangeTodo={jest.fn()}
          onRemoveTodo={jest.fn()}
        />,
      ),
    ).toBeDefined();
  });

  it('should change status', () => {
    const todo = todoBuild();
    const spyChange = jest.fn();
    render(
      <TodoItem
        todo={todo}
        onChangeTodo={spyChange}
        onRemoveTodo={jest.fn()}
      />,
    );

    userEvent.click(screen.getByRole('checkbox'));

    expect(spyChange).toHaveBeenCalledWith({ done: !todo.done });
  });

  it('should edit the todo on blur', () => {
    const todo = todoBuild();
    const spyChange = jest.fn();
    render(
      <TodoItem
        todo={todo}
        onChangeTodo={spyChange}
        onRemoveTodo={jest.fn()}
      />,
    );

    userEvent.dblClick(screen.getByText(todo.text));
    userEvent.type(screen.getByRole('textbox'), '{selectall}Make a salad');
    fireEvent.blur(screen.getByRole('textbox'));

    expect(spyChange).toHaveBeenCalledWith({ text: 'Make a salad' });
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should edit the todo on type {enter}', () => {
    const todo = todoBuild();
    const spyChange = jest.fn();
    render(
      <TodoItem
        todo={todo}
        onChangeTodo={spyChange}
        onRemoveTodo={jest.fn()}
      />,
    );

    userEvent.dblClick(screen.getByText(todo.text));
    userEvent.clear(screen.getByRole('textbox'));
    userEvent.type(screen.getByRole('textbox'), 'Make exercise{enter}');

    expect(spyChange).toHaveBeenCalledWith({ text: 'Make exercise' });
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should abort edit the todo', () => {
    const todo = todoBuild();
    const spyChange = jest.fn();
    render(
      <TodoItem
        todo={todo}
        onChangeTodo={spyChange}
        onRemoveTodo={jest.fn()}
      />,
    );

    userEvent.dblClick(screen.getByText(todo.text));
    userEvent.clear(screen.getByRole('textbox'));
    userEvent.type(screen.getByRole('textbox'), 'Make exercise{esc}');

    expect(spyChange).not.toHaveBeenCalled();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should show validation error', async () => {
    const todo = todoBuild();
    const spyChange = jest.fn();
    render(
      <TodoItem
        todo={todo}
        onChangeTodo={spyChange}
        onRemoveTodo={jest.fn()}
      />,
    );

    userEvent.dblClick(screen.getByText(todo.text));
    userEvent.type(
      screen.getByRole('textbox'),
      '{selectall}{backspace}{enter}',
    );

    await expect(
      screen.findByText(/Text is a required field/i),
    ).resolves.toBeInTheDocument();

    expect(spyChange).not.toHaveBeenCalled();

    userEvent.clear(screen.getByRole('textbox'));
    await userEvent.type(
      screen.getByRole('textbox'),
      'Cursus chuña dignissim cachimbo pedo ut egestas. In bajar cherche placerat gravida zumba. Gravida chucheria webiar vergon enim tetelque chocoya.',
    );
    fireEvent.blur(screen.getByRole('textbox'));

    await expect(
      screen.findByText(/Text must be at most 140 characters/i),
    ).resolves.toBeInTheDocument();

    expect(spyChange).not.toHaveBeenCalled();
  });

  it('should not cache the changes of text between edit', () => {
    const todo = todoBuild({ overrides: { text: 'Work it. Make it.' } });
    const spyChange = jest.fn();
    render(
      <TodoItem
        todo={todo}
        onChangeTodo={spyChange}
        onRemoveTodo={jest.fn()}
      />,
    );

    userEvent.dblClick(screen.getByText(todo.text));
    userEvent.clear(screen.getByRole('textbox'));
    userEvent.type(
      screen.getByRole('textbox'),
      'Harder, Better, Faster, Stronger{esc}',
    );

    userEvent.dblClick(screen.getByText(todo.text));
    userEvent.type(screen.getByRole('textbox'), ' Do it. Makes us.{enter}');

    expect(spyChange).toHaveBeenCalledWith({
      text: 'Work it. Make it. Do it. Makes us.',
    });
  });

  it('should remove delete the todo', () => {
    const todo = todoBuild();
    const spyRemove = jest.fn();
    render(
      <TodoItem
        todo={todo}
        onChangeTodo={jest.fn()}
        onRemoveTodo={spyRemove}
      />,
    );

    userEvent.click(screen.getByRole('button', { name: /Delete todo/i }));

    expect(spyRemove).toHaveBeenCalled();
  });
});
