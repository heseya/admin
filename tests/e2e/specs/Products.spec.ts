describe('Products page', () => {
  it('should load products page', () => {
    cy.login()
    cy.visit('/products')
    cy.get('h1').should('contain', 'Asortyment')
  })
})

describe('add new product', () => {

  it('add new product', () => {
  
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

    const uuid = () => Cypress._.random(0, 1e6)
    const id = uuid()
    const productName = `product${id}`

    cy.get('input[label="Nazwa"]').type(productName)
    cy.get('input[label="Link"]').type(productName)
    cy.get('input[label="Cena"]').clear().type('100')
    cy.get('input[label="Format ilości"]').clear().type('25')
    cy.get('[data-placeholder="Insert text here ..."]').type('lorem ipsum')

    cy.get('.app-button__text').contains('Zapisz').click()
    cy.get('.v-toast__text').contains('Produkt został utworzony').should('be.visible')
    cy.get('.icon-button__text').contains(' Wróć do listy ').click()
    cy.get('.paginated-list__list').contains(productName).should('be.visible')

  })
  
})




