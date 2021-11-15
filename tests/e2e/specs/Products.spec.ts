describe('Products page', () => {
  it('should load products page', () => {
    cy.login()
    cy.visit('/products')
    cy.get('h1').should('contain', 'Asortyment')
  })
})

describe('add new product', () => {
  it('add new product', () => {
    cy.intercept('GET', '/products/id:*').as('getProduct')

    cy.get('.icon-button__text').contains('Dodaj produkt').click()

    cy.on('uncaught:exception', () => {
      // TODO: Article Editor throw werid error when routing to new page
      return false
    })

    /*cy.get('#app > main > div > div > div.gallery > div > div').click()

    cy.fixture('photo.jpg', 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then(fileContent => {
        cy.get('input[accept="image/jpeg, image/png, image/jpg"]').attachFile({
            fileContent,
            fileName: 'photo.jpg',
            mimeType: 'image/jpg',
            encoding: 'utf8'
        })
    })*/

    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const productName = `Cypress Product ${id}`

    cy.get('input[label="Nazwa"]').type(productName)
    cy.get('input[label="Cena"]').clear().type('100')
    cy.get('input[label="Format ilości"]').clear().type('5')

    cy.get('.app-button__text').contains('Zapisz').click()

    cy.wait('@getProduct')

    cy.dataCy('nav-title').should('contain', productName)
  })
})
