describe('Collections page', () => {
  it('should load collections page', () => {
    cy.login()
    cy.visit('/collections')
    cy.get('h1').should('contain', 'Collections')
  })
})

describe('add new collection', () => {
  it('add new items', () => {
    // TODO: Article Editor throw werid error when routing to new page
    cy.on('uncaught:exception', () => false)

    cy.get('.icon-button__text').contains('Add collection').click() // TODO : change to data-cy

    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const collectionName = `col${id}`
    const subCollectionName = `sub${id}`

    cy.get('input[label="Name"]').type(collectionName) // TODO : change to data-cy
    cy.get('.app-button__text').contains('Save').click() // TODO : change to data-cy
    cy.get('.app__content').contains(collectionName).should('be.visible')
    cy.get('.product-set__content')
      .contains(collectionName)
      .closest('.product-set__content')
      .children('.product-set__actions')
      .click()
    cy.get('.ant-dropdown-menu-item').contains('Add subset').click() // TODO : change to data-cy
    cy.get('input[label="Name"]').type(subCollectionName) // TODO : change to data-cy
    cy.get('.app-button__text').contains('Save').click() // TODO : change to data-cy
    //cy.get('.app__content').contains(collectionName).click()
    cy.get('.app__content').should('contain', subCollectionName)
  })
})
