describe('Schemas page', () => {
  it('should load schemas page', () => {
    cy.login()
    cy.visit('/schemas')
    cy.get('h1').should('contain', 'Schemas')
  })

  it('add schema product', () => {
    cy.intercept('GET', '/schemas/id:*').as('getSchema')

    cy.dataCy('add-btn').click()

    const schemaName = `Cypress Schema ${cy.util.uuid()}`
    const schemaDescription = `Cypress Schema Description ${cy.util.uuid()}`
    const schemaDefault = `${cy.util.uuid()}`
    const schemaString = `$Cypress Schema String${cy.util.uuid()}`

    cy.dataCy('name').type(schemaName)
    cy.dataCy('price').clear().type('100')

    cy.dataCy('type')
      .click()
      .get('.ant-select-dropdown-menu-item')
      .contains('Text value') // TODO : change to data-cy
      .click()

    cy.dataCy('description').type(schemaDescription)
    cy.dataCy('default').type(schemaDefault)
    cy.dataCy('pattern').type(schemaString)
    cy.dataCy('validation').type(schemaString)

    cy.dataCy('submit-btn').click()

    cy.wait('@getSchema')

    cy.dataCy('nav-title').should('contain', schemaName)
  })

  it('schema cannot be hidden & required at the same time', () => {
    cy.dataCy('hidden').click()
    cy.dataCy('hidden')
      .parent()
      .get('.switch-input__error')
      .should('contain', 'A scheme cannot be both hidden and required')
  })

  it('schema can be removed', () => {
    cy.dataCy('delete-btn').click()

    cy.get('.ant-popover .app-button').contains('Delete').click() // TODO : change to data-cy

    cy.url().should('eq', `${Cypress.config().baseUrl}schemas`)
  })
})
