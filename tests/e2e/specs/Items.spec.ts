describe('Items page', () => {
  it('should load items page', () => {
    cy.login()
    cy.visit('/items')
    cy.get('h1').should('contain', 'Warehouse')
  })
})

describe('add new items', () => {
  it('add new items', () => {
    cy.dataCy('add-btn').click()

    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const itemName = `Item${id}`
    const skuName = `SKU${id}`

    cy.dataCy('name').type(itemName)
    cy.dataCy('sku').type(skuName)
    cy.dataCy('save-btn').click()

    cy.get('.app__content').contains(skuName).should('be.visible')
    cy.get('.app__content').contains(skuName).click()

    cy.dataCy('deposit-create-btn').click()
    cy.dataCy('quantity').clear().type('100')
    cy.dataCy('deposit-add-btn').click()

    cy.dataCy('total-quantity').should('have.text', '100')
  })
})
