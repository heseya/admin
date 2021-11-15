describe('Discounts page', () => {
  it('should load discounts page', () => {
    cy.login()
    cy.visit('/discounts')
    cy.get('h1').should('contain', 'Kody rabatowe')
  })
})

describe('add new discount', () => {
  it('add new discount', () => {
    cy.get('.icon-button__text').contains('Dodaj kod rabatowy').click()

    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const discountName = `CODE${id}`

    cy.get('input[label="Kod"]').type(discountName)
    cy.get('input[label="Opis"]').type('winter sale')
    cy.get('input[label="Zniżka"]').clear().type('20')
    cy.get('input[label="Maksymalna ilość użyć"]').clear().type('10')
    cy.get('.app-button__text').contains('Zapisz').click()
    cy.get('.app__content').contains(discountName).should('be.visible')
  })
})
