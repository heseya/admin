// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const dataCyCommand = (value: string) => {
  return cy.get(`[data-cy=${value}]`)
}

const loginCommand = (email = '***REMOVED***', password = '***REMOVED***') => {
  cy.intercept('POST', '/login').as('login')

  cy.visit('/login')
  cy.dataCy('email').type(email)
  cy.dataCy('password').type(password)
  cy.dataCy('submitBtn').click()
  cy.wait('@login')
}

Cypress.Commands.add('login', loginCommand)
Cypress.Commands.add('dataCy', dataCyCommand)

declare namespace Cypress {
  interface Chainable<Subject> {
    dataCy(value: string): Chainable<Subject>
    login: typeof loginCommand
  }
}
