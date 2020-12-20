import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilterTodo from 'components/todo/filter-todo';
import { helpers } from 'faker';
import React from 'react';

describe('<FilterTodo />', () => {
  it('should render', () => {
    expect(
      render(
        <FilterTodo
          all={0}
          completed={0}
          active={0}
          filter="all"
          onChangeFilter={jest.fn()}
          onClearCompleted={jest.fn()}
        />,
      ),
    ).toBeDefined();
    expect(screen.queryByText('Clear completed')).not.toBeInTheDocument();
  });

  it('should switch the filter', () => {
    const spyChangeFilter = jest.fn();
    const { rerender } = render(
      <FilterTodo
        all={0}
        completed={0}
        active={0}
        filter="all"
        onChangeFilter={spyChangeFilter}
        onClearCompleted={jest.fn()}
      />,
    );

    helpers.shuffle(['all', 'completed', 'active']).forEach(filter => {
      userEvent.click(
        screen.getByRole('button', { name: RegExp(filter, 'i') }),
      );

      expect(spyChangeFilter).toHaveBeenCalledWith(filter);

      rerender(
        <FilterTodo
          all={0}
          completed={0}
          active={0}
          filter={filter}
          onChangeFilter={spyChangeFilter}
          onClearCompleted={jest.fn()}
        />,
      );
    });
  });

  it('should click «Clear completed»', () => {
    const spyClearCompleted = jest.fn();
    render(
      <FilterTodo
        all={0}
        completed={1}
        active={0}
        filter="all"
        onChangeFilter={jest.fn()}
        onClearCompleted={spyClearCompleted}
      />,
    );

    userEvent.click(screen.getByRole('button', { name: 'Clear completed' }));

    expect(spyClearCompleted).toHaveBeenCalled();
  });
});
