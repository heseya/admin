describe('Discounts page', () => {
  it('should load discounts page', () => {
    cy.login()
    cy.visit('/discounts')
    cy.get('h1').should('contain', 'Discount codes')
  })
})

describe('add new discount', () => {
  it('add new discount', () => {
    cy.get('.icon-button__text').contains('Add discount code').click() // TODO : change to data-cy

    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const discountName = `CODE${id}`

    cy.get('input[label="Code"]').type(discountName) // TODO : change to data-cy
    cy.get('input[label="Description"]').type('winter sale') // TODO : change to data-cy
    cy.get('input[label="Discount"]').clear().type('20') // TODO : change to data-cy
    cy.get('input[label="Max uses"]').clear().type('10') // TODO : change to data-cy
    cy.get('.app-button__text').contains('Save').click() // TODO : change to data-cy
    cy.get('.app__content').contains(discountName).should('be.visible')
  })
})
