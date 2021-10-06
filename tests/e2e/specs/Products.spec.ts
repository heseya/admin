describe('Products page', () => {
  it('should load products page', () => {
    cy.login()
    cy.visit('/products')
    cy.get('h1').should('contain', 'Asortyment')
  })
})
