const uuid = () => Cypress._.random(0, 1e6)

describe('Products page', () => {
  it('should load products page', () => {
    cy.login()
    cy.visit('/products')
    cy.get('h1').should('contain', 'Asortyment')
  })

  it('add new product', () => {
    // TODO: Article Editor throw werid error when routing to new page
    cy.on('uncaught:exception', () => false)

    cy.intercept('GET', '/products/id:*').as('getProduct')

    cy.get('.icon-button__text').contains('Dodaj produkt').click()

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

    const productName = `Cypress Product ${uuid()}`

    cy.dataCy('name').type(productName)
    cy.dataCy('price').clear().type('100')
    cy.dataCy('quantity_step').clear().type('5')

    cy.dataCy('submit-btn').click()

    cy.wait('@getProduct')

    cy.dataCy('nav-title').should('contain', productName)
  })

  it('can edit product', () => {
    // TODO: Article Editor throw werid error when routing to new page
    cy.on('uncaught:exception', () => false)

    cy.intercept('PATCH', '/products/id:*').as('saveProduct')

    const renamedProductName = `Renamed Cypress Product ${uuid()}`

    cy.dataCy('name').clear().type(renamedProductName)
    cy.dataCy('price').clear().type('3000')

    cy.dataCy('submit-btn').click()

    cy.wait('@saveProduct')
  })

  it('can set product price to 0', () => {
    // TODO: Article Editor throw werid error when routing to new page
    cy.on('uncaught:exception', () => false)

    cy.intercept('PATCH', '/products/id:*').as('saveProduct')

    cy.dataCy('price').clear().type('0')

    cy.dataCy('submit-btn').click()

    cy.wait('@saveProduct')
  })
})
