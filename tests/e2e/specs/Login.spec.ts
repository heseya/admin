it('Login to the app', () => {
  cy.login()
  cy.url().should('eq', Cypress.config().baseUrl)
})
