describe('Schemas page', () => {
  it('should load schemas page', () => {
    cy.login()
    cy.visit('/schemas')
    cy.get('h1').should('contain', 'Schematy')
  })

  it('add schema product', () => {
    cy.intercept('GET', '/schemas/id:*').as('getSchema')

    cy.dataCy('add-btn').click()

    const schemaName = `Cypress Schema ${cy.util.uuid()}`

    cy.dataCy('name').type(schemaName)
    cy.dataCy('price').clear().type('100')

    cy.dataCy('type')
      .click()
      .get('.ant-select-dropdown-menu-item')
      .contains('Wartość tekstowa')
      .click()

    cy.dataCy('submit-btn').click()

    cy.wait('@getSchema')

    cy.dataCy('nav-title').should('contain', schemaName)
  })

  it('schema cannot be hidden & required at the same time', () => {
    cy.dataCy('hidden').click()
    cy.dataCy('hidden')
      .parent()
      .get('.switch-input__error')
      .should('contain', 'Schemat nie może być jednocześnie ukryty i wymagany')
  })

  it('schema can be removed', () => {
    cy.dataCy('delete-btn').click()

    cy.get('.ant-popover .app-button').contains('Usuń').click()

    cy.url().should('eq', `${Cypress.config().baseUrl}schemas`)
  })
})
