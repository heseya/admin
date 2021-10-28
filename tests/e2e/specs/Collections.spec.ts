describe('Collections page', () => {
    it('should load collections page', () => {
      cy.login()
      cy.visit('/collections')
      cy.get('h1').should('contain', 'Kolekcje produktów')
  })
})

describe('add new collection', () => {

  it('add new items', () => {
     
    cy.get('.icon-button__text').contains('Dodaj kolekcję').click()

    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const collectionName = `col${id}`
    const subCollectionName = `sub${id}`

    cy.get('input[label="Nazwa"]').type(collectionName)
    cy.get('.app-button__text').contains('Zapisz').click()
    cy.get('.app__content').contains(collectionName).should('be.visible')
    cy.get('.product-set__content').contains(collectionName).closest('.product-set__content').children('.product-set__actions').click()
    cy.get('.ant-dropdown-menu-item').contains('Dodaj subkolekcje').click()
    cy.get('input[label="Nazwa"]').type(subCollectionName)
    cy.get('.app-button__text').contains('Zapisz').click()
    //cy.get('.app__content').contains(collectionName).click()
    cy.get('.app__content').should('contain', subCollectionName)
  })

})