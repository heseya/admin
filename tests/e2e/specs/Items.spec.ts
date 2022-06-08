describe('Items page', () => {
  it('should load items page', () => {
    cy.login()
    cy.visit('/items')
    cy.get('h1').should('contain', 'Warehouse')
  })
})

describe('add new items', () => {
  it('add new items', () => {
    cy.get('.icon-button__text').contains('Add item').click() // TODO : change to data-cy

    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const itemName = `Item${id}`
    const skuName = `SKU${id}`

    cy.get('input[label="Name"]').type(itemName) // TODO : change to data-cy
    cy.get('input[label="SKU"]').type(skuName) // TODO : change to data-cy
    cy.get('.app-button__text').contains('Save').click() // TODO : change to data-cy
    cy.get('.app__content').contains(skuName).should('be.visible')
    cy.get('.app__content').contains(skuName).click()
    cy.get('.icon-button__text').contains('Add deposit').click()
    cy.get('input[label="Quantity"]').clear().type('100') // TODO : change to data-cy
    cy.get('.app-button__text').contains('Add').click()
    cy.get('.app-button__text').contains('Save').click() // TODO : change to data-cy
  })
})
