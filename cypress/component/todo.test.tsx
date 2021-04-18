import Todo from 'components/todo';
import { mount } from 'cypress-react-unit-test';
import React from 'react';
import {
  createTodoBuild,
  randomArrayElement,
  todoBuild,
} from 'utils/factories';

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
  const clearCompletedButton = /Clear completed/i;

  beforeEach(() => {
    cy.intercept('GET', '/api/todos', req => {
      req.reply(todos);
    }).as('listTodo');
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

  it('should clear the completed ones', () => {
    cy.intercept('DELETE', '**/api/todos/**', { statusCode: 204, body: null });
    mount(<Todo />);

    cy.findByRole('button', { name: clearCompletedButton }).click();

    cy.findAllByRole('listitem').should('have.lengthOf', activeCount);
    cy.findByRole('button', { name: clearCompletedButton }).should('not.exist');
    cy.findByRole('button', { name: /Completed \(0\)/i }).should('exist');
  });

  it('should create a new todo and add to list', () => {
    const todo = todoBuild();
    cy.intercept('POST', '/api/todos', { statusCode: 201, body: todo }).as(
      'saveTodo',
    );
    mount(<Todo />);

    cy.findByRole('textbox', { name: /Text/ }).type(todo.text);
    cy.findByRole('button', { name: /^Add$/i }).click();

    cy.wait('@saveTodo');

    cy.findAllByRole('listitem').should('have.lengthOf', todos.length + 1);
    cy.findAllByRole('listitem').first().should('contain.text', todo.text);
  });

  it('should edit one todo', () => {
    const todo = randomArrayElement(todos);
    const { text } = createTodoBuild();
    cy.intercept('PUT', '**/api/todos/**', {
      statusCode: 200,
      body: {
        ...todo,
        text,
        updatedAt: new Date().toISOString(),
      },
    });
    mount(<Todo />);

    cy.findByRole('listitem', { name: `Double click to edit ${todo.text}` })
      .scrollIntoView()
      .dblclick();
    cy.findByRole('textbox', { name: /Edit text/i })
      .clear()
      .type(text)
      .type('{enter}');

    cy.findByText(text).should('exist');
  });

  it('should change status of one todo', () => {
    const todo = randomArrayElement(todos);
    const newActiveCount = activeCount + (todo.done ? 1 : -1);
    const newCompletedCount = completedCount + (todo.done ? -1 : 1);
    cy.intercept('PUT', '**/api/todos/**', req => {
      const {
        groups: { id },
      } = /\/api\/todos\/(?<id>.*)/.exec(req.url);
      const todo = todos.find(todo => todo.id === id);

      req.reply(200, {
        ...todo,
        ...req.body,
        updatedAt: new Date().toISOString(),
      });
    });
    mount(<Todo />);

    cy.findByRole('listitem', { name: RegExp(todo.text) })
      .findByRole('checkbox')
      .click();

    cy.findByText(RegExp(`${newActiveCount} items left`, 'i')).should('exist');
    cy.findByRole('button', {
      name: RegExp(`Active \\(${newActiveCount}\\)`, 'i'),
    }).should('exist');
    cy.findByRole('button', {
      name: RegExp(`Completed \\(${newCompletedCount}\\)`, 'i'),
    }).should('exist');
  });

  it('should remove one todo', () => {
    const todo = randomArrayElement(todos);
    cy.intercept('DELETE', '**/api/todos/**', { statusCode: 204, body: null });
    mount(<Todo />);

    cy.findByRole('listitem', { name: RegExp(todo.text) })
      .findByRole('button', { name: /Delete todo/ })
      .click();

    cy.findByText(todo.text).should('not.exist');
    cy.findAllByRole('listitem')
      .its('length')
      .should('equal', todos.length - 1);
  });

  it('should revert remove on error', () => {
    const todo = randomArrayElement(todos);
    cy.intercept(
      {
        method: 'DELETE',
        url: '**/api/todos/**',
      },
      {
        statusCode: 503,
        body: {
          statusCode: 503,
          message: 'Database connection error',
        },
        delayMs: 2e3,
      },
    );
    mount(<Todo />);

    cy.findByRole('listitem', { name: RegExp(todo.text) })
      .findByRole('button', { name: /Delete todo/ })
      .click();

    cy.findByText(todo.text).should('not.exist');
    cy.findAllByRole('listitem')
      .its('length')
      .should('equal', todos.length - 1);

    cy.findByRole('alert').should('contain.text', 'Database connection error');
    cy.findByText(todo.text).should('exist');
    cy.findAllByRole('listitem').should('have.length', todos.length);
    cy.findByText(RegExp(`${activeCount} items left`, 'i')).should('exist');
    cy.findByText(allButton).should('exist');
    cy.findByText(activeButton).should('exist');
    cy.findByText(completedButton).should('exist');
  });

  it('should revert changes when update request fail', () => {
    const todo = randomArrayElement(todos);
    const { text } = createTodoBuild();
    cy.intercept(
      {
        method: 'PUT',
        url: '**/api/todos/**',
      },
      {
        statusCode: 503,
        body: {
          statusCode: 503,
          message: 'Database connection error',
        },
        delayMs: 2e3,
      },
    );
    mount(<Todo />);

    cy.findByRole('listitem', { name: `Double click to edit ${todo.text}` })
      .scrollIntoView()
      .dblclick();
    cy.findByRole('textbox', { name: /Edit text/i })
      .clear()
      .type(text)
      .type('{enter}');
    cy.findByText(text).should('exist');

    cy.findByRole('alert').should('contain.text', 'Database connection error');
    cy.findByText(todo.text).should('exist');
    cy.findByText(RegExp(`${activeCount} items left`, 'i')).should('exist');
  });
});
