const util = {
  uuid: () => Cypress._.random(0, 1e6),
}

cy.util = util

declare namespace Cypress {
  interface Chainable {
    util: typeof util
  }
}
