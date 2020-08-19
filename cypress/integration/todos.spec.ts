import faker from 'faker';

describe('Todos page', () => {
  beforeEach(() => {
    cy.login(Cypress.env('username'), Cypress.env('password'));
    cy.server()
      .route('POST', '/api/todos')
      .as('save-todo')
      .route('PUT', '/api/todos/*')
      .as('edit-todo')
      .route('DELETE', '/api/todos/*')
      .as('remove-todo')
      .visit('/todos');
  });

  it('should list the todos', () => {
    cy.findByRole('list', { name: /List of Todo/i }).within(() => {
      cy.findAllByRole('listitem').should('have.length.gte', 1);
    });
  });

  it('should add a todo', () => {
    const text = faker.hacker.phrase();

    cy.findByRole('textbox', { name: /Text/i }).type(text);
    cy.findByRole('button', { name: /Add/i }).click();
    cy.findByText(text);

    cy.wait('@save-todo').its('status').should('equal', 201);
  });

  it('should mark one todo as completed', () => {
    cy.findAllByRole('listitem')
      .first()
      .within(() => {
        cy.findByRole('checkbox', { name: /^Mark as done$/i }).click();
        cy.wait('@edit-todo')
          .its('responseBody')
          .should('satisfy', todo => todo.done);
      });
  });

  it('should edit one', () => {
    cy.findAllByRole('listitem')
      .first()
      .next()
      .within(() => {
        const text = faker.lorem.sentence();

        cy.findAllByRole('button').first().dblclick();
        cy.findByRole('textbox').clear().type(text).type('{enter}');
        cy.wait('@edit-todo')
          .its('responseBody')
          .should('satisfy', todo => todo.text === text);
      });
  });

  it('should remove one', () => {
    cy.findAllByRole('listitem')
      .last()
      .within(() => {
        cy.findByRole('button', { name: /^Delete todo/i }).click();
        cy.wait('@remove-todo').its('status').should('equal', 204);
      });
  });
});
