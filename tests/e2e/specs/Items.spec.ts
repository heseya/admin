describe('Items page', () => {
  const id = cy.util.uuid()
  const itemName = `Item-${id}`
  const skuName = `SKU-${id}`

  it('should load items page', () => {
    cy.login()
    cy.visit('/items')
    cy.get('h1').should('contain', 'Warehouse')
  })

  it('add new items', () => {
    cy.dataCy('add-btn').click()

    cy.dataCy('name').type(itemName, { delay: 30 })
    cy.dataCy('sku').type(skuName, { delay: 30 })
    cy.dataCy('save-btn').click()

    cy.get('.app__content').contains(skuName).should('be.visible')
    cy.get('.app__content').contains(skuName).click()
  })

  it('adds deposit to item', () => {
    cy.dataCy('deposit-create-btn').click()
    cy.dataCy('quantity').clear().type('12')
    cy.dataCy('deposit-add-btn').click()

    cy.dataCy('total-quantity').should('have.text', ' 120 ')
  })

  it('removes item', () => {
    cy.dataCy('delete-btn').click()
    cy.dataCy('pop-confirm-btn').click()

    cy.get('.app__content').contains(skuName).should('not.exist')
  })
})
