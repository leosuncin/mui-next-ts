import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTodo from 'components/todo/add-todo';
import React from 'react';

describe('<AddTodo />', () => {
  const textLabel = /Text/i;
  const submitButton = /Add/i;

  it('should render', () => {
    expect(render(<AddTodo onSubmit={jest.fn()} />)).toBeDefined();
  });

  it("should submit todo's text", async () => {
    const spySubmit = jest.fn();

    render(<AddTodo onSubmit={spySubmit} />);

    userEvent.type(screen.getByLabelText(textLabel), 'Make a sandwich');
    userEvent.click(screen.getByRole('button', { name: submitButton }));

    await waitFor(() => {
      expect(spySubmit).toHaveBeenCalledWith({ text: 'Make a sandwich' });
    });
  });

  it("should validate the todo's text", async () => {
    const spySubmit = jest.fn();
    render(<AddTodo onSubmit={spySubmit} />);

    userEvent.click(screen.getByRole('button', { name: submitButton }));
    await screen.findByText(/Text is a required field/i);

    userEvent.type(
      screen.getByLabelText(textLabel),
      `Lorem ipsum dolor sit amet consectetur adipisicing elit.
Nobis asperiores quisquam quos assumenda esse voluptatum laborum accusantium,
eveniet voluptate ex laudantium quas deleniti et aspernatur animi fuga pariatur facere corporis!`,
    );
    await screen.findByText(/Text must be at most 140 characters/i);

    expect(spySubmit).not.toHaveBeenCalled();
  });
});
