// home.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('show the title', () => {
    cy.title().should('equal', 'CRUD dashboard');
  });
});
