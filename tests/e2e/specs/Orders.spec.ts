describe('Orders page', () => {
  it('should load orders page', () => {
    cy.login()
    cy.visit('/orders')
    cy.get('h1').should('contain', 'Orders')
  })
})
