/// <reference types="Cypress" />
/// <reference types="@types/testing-library__cypress" />
const sessionUser = JSON.stringify({
  id: '760add88-0a2b-4358-bc3f-7d82245c5dea',
  username: 'admin',
  name: 'Administrator',
  picture: 'https://i.pravatar.cc/200',
  bio:
    'Pig swine prosciutto venison strip steak, drumstick frankfurter hamburger spare ribs pork loin meatball leberkas. Biltong jerky boudin pork chop swine ground round landjaeger, pork chuck. Tri-tip boudin cow ham cupim flank. Spare ribs sausage turducken venison.',
});

describe('Main page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should redirect to login', () => {
    cy.location('pathname').should('equal', '/login');
  });

  context('with session', () => {
    before(() => {
      Cypress.Cookies.preserveOnce('sessionUser');
      cy.clearCookies().setCookie('sessionUser', sessionUser);
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
        .location('pathname')
        .should('equal', '/login');
    });
  });
});
