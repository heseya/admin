# Heseya Store Admin Dashboard

Recommended IDE Plugin: [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Project setup

```
$ yarn

$ cp .env.example .env
```

### Compiles and hot-reloads for development

```
$ yarn dev
```

### Compiles and minifies for production

```
$ yarn build
```

### Lints and fixes files

```
$ yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## End-to-end testing

E2E tests are written and run using [Cypress](https://www.cypress.io/).
In order to run them, just execute the command

```
$ yarn test:e2e
```

The Cypress interface will then be launched to enable testing.

To run all tests without an interface, run the command

```
$ yarn test:e2e --headless
```

### Best practices

All tests should be written in **Typescript**.

We try to stick to the practices described in [Cypress documentation](https://docs.cypress.io/guides/references/best-practices), with particular reference to the rule recommending [selection of elements by means of attributes `data-cy`](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements) rather than `id`, `class`, or HTML tags.

### Helper methods

| Name                                          | Description                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `cy.dataCy(value: string)`                    | The equivalent of `cy.get()`, which automatically finds an element using its attribute `data-cy` |
| `cy.login(email?: string, password?: string)` | Automatically carries out the user login procedure.                                              |
