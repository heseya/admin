describe('Settings page', () => {
    it('should load settings page', () => {
      cy.login()
      cy.visit('/settings')
      cy.get('h1').should('contain', 'Ustawienia')
    })
  })