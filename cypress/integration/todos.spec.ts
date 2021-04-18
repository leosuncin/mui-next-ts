import { createTodoBuild } from 'utils/factories';

describe('Todos page', () => {
  beforeEach(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'));
    cy.intercept('POST', '/api/todos')
      .as('save-todo')
      .intercept('PUT', '**/api/todos/**')
      .as('edit-todo')
      .intercept('DELETE', '**/api/todos/**')
      .as('remove-todo')
      .visit('/todos');
  });

  it('should list the todos', () => {
    cy.findByRole('list', { name: /List of Todo/i }).within(() => {
      cy.findAllByRole('listitem').should('have.length.gte', 1);
    });
  });

  it('should add a todo', () => {
    const { text } = createTodoBuild();

    cy.findByRole('textbox', { name: /Text/i }).type(text);
    cy.findByRole('button', { name: /Add/i }).click();
    cy.findByText(text);

    cy.wait('@save-todo').its('response.statusCode').should('equal', 201);
  });

  it('should mark one todo as completed', () => {
    cy.findAllByRole('listitem')
      .first()
      .within(() => {
        cy.findByRole('checkbox', { name: /^Mark as done$/i }).click();
        cy.wait('@edit-todo')
          .its('response.body')
          .should('satisfy', todo => todo.done);
      });
  });

  it('should edit one', () => {
    cy.findAllByRole('listitem')
      .first()
      .next()
      .within(() => {
        const { text } = createTodoBuild();

        cy.findAllByRole('button').first().dblclick();
        cy.findByRole('textbox').clear().type(text).type('{enter}');
        cy.wait('@edit-todo')
          .its('response.body')
          .should('satisfy', todo => todo.text === text);
      });
  });

  it('should remove one', () => {
    cy.findAllByRole('listitem')
      .last()
      .within(() => {
        cy.findByRole('button', { name: /^Delete todo/i }).click();
        cy.wait('@remove-todo').its('response.statusCode').should('equal', 204);
      });
  });
});
