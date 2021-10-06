it('Login to the app', () => {
  cy.visit('/login')
  cy.dataCy('email').type('***REMOVED***')
  cy.dataCy('password').type('***REMOVED***')
  cy.dataCy('submitBtn').click()

  cy.url().should('eq', Cypress.config().baseUrl)
})
