it('loads the app', () => {
  cy.visit('/login')
  cy.get('#app').should('be.visible')
})
