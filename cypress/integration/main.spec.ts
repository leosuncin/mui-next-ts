describe('Main page', () => {
  beforeEach(() => {
    cy.intercept('DELETE', '/api/auth/logout').as('logout').visit('/');
  });

  it('should redirect to login', () => {
    cy.location('pathname').should('equal', '/login');
  });

  context('with session', () => {
    before(() => {
      cy.login(Cypress.env('username'), Cypress.env('password'));
    });

    it('should show main page', () => {
      cy.findByText(/Main page/i, { selector: ':not(title)' });
      cy.findByTestId('profile-menu').click({ force: true });
      cy.findByTestId('app-menu').click({ force: true });
    });

    it('should allow to logout', () => {
      cy.findByTestId('profile-menu').click();
      cy.findByText(/Logout/i)
        .click()
        .wait('@logout');
      cy.location('pathname').should('equal', '/login');
    });
  });
});
