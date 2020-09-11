import Todo from 'components/todo';
import { mount } from 'cypress-react-unit-test';
import React from 'react';
import { todoBuild } from 'utils/factories';

describe('Todo component', () => {
  const todos = Array.from({ length: 10 }, () => todoBuild({ traits: 'old' }));
  const activeCount = todos.reduce(
    (count, todo) => count + ((!todo.done as unknown) as number),
    0,
  );
  const completedCount = todos.length - activeCount;
  const allButton = RegExp(`All \\(${todos.length}\\)`, 'i');
  const activeButton = RegExp(`Active \\(${activeCount}\\)`, 'i');
  const completedButton = RegExp(`Completed \\(${completedCount}\\)`, 'i');

  beforeEach(() => {
    cy.server().route('GET', '/api/todos?page=*', todos).as('listTodo');
  });

  it('should list the todos', () => {
    mount(<Todo />);

    cy.findAllByRole('listitem').its('length').should('equal', todos.length);
    cy.findByText(RegExp(`${activeCount} items left`, 'i')).should('exist');
    cy.findByText(allButton).should('exist');
    cy.findByText(activeButton).should('exist');
    cy.findByText(completedButton).should('exist');
  });

  it('should filter the displayed todos', () => {
    mount(<Todo />);

    cy.findByRole('button', { name: activeButton }).click();
    cy.findAllByRole('listitem').should('have.lengthOf', activeCount);

    cy.findByRole('button', { name: allButton }).click();
    cy.findAllByRole('listitem').should('have.lengthOf', todos.length);

    cy.findByRole('button', { name: completedButton }).click();
    cy.findAllByRole('listitem').should('have.lengthOf', completedCount);
  });
});
