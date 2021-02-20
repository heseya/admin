import { extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'To pole jest wymagane',
})

extend('password', {
  params: ['target'],
  validate(password, { target }) {
    return password === target
  },
  message: 'Powtórzone hasło różni się od nowego hasła',
})

extend('positive', {
  message: 'To pole musi być większe od zera',
  validate: (value) => {
    return value > 0
  },
})
extend('not-negative', {
  message: 'To pole nie może być mniejsze od 0',
  validate: (value) => {
    return value >= 0
  },
})

extend('id-required', {
  message: 'To pole jest wymagane',
  validate: (value) => {
    return value !== 0
  },
})

extend('slug', {
  message: 'Link może składać się tylko z małych liter, cyfr i myślników',
  validate: (value) => {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
  },
})
