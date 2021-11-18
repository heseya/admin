describe('Items page', () => {
  it('should load items page', () => {
    cy.login()
    cy.visit('/items')
    cy.get('h1').should('contain', 'Magazyn')
  })
})

describe('add new items', () => {
  it('add new items', () => {
    cy.get('.icon-button__text').contains('Dodaj przedmiot').click()

    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const itemName = `Item${id}`
    const skuName = `SKU${id}`

    cy.get('input[label="Nazwa"]').type(itemName)
    cy.get('input[label="SKU"]').type(skuName)
    cy.get('.app-button__text').contains('Zapisz').click()
    cy.get('.app__content').contains(skuName).should('be.visible')
    cy.get('.app__content').contains(skuName).click()
    cy.get('input[label="Ilość w magazynie"]').clear().type('100')
    cy.get('.app-button__text').contains('Zapisz').click()
    cy.get('.app__content').contains(skuName).should('be.visible')
  })
})
