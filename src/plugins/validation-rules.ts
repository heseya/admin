import { ShippingMethodPriceRangeDTO } from '@/interfaces/ShippingMethod'
import { extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'

extend('required', {
  ...required,
  message: 'To pole jest wymagane',
})
extend('email', {
  ...email,
  message: 'Wprowadź poprawny adres email',
})

extend('repeatPassword', {
  params: ['target'],
  validate(password, { target }: Record<string, any>) {
    return password === target
  },
  message: 'Powtórzone hasło różni się od nowego hasła',
})

extend('password', {
  validate(password) {
    return password.length >= 10
  },
  message: 'Hasło musi mieć przynajmniej 10 znaków',
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

extend('letters-only', {
  message: 'Wartość może składać się tylko z liter i podkreślników (_)',
  validate: (value) => {
    return /^[a-zA-Z_]+(?:[a-zA-Z]+)*$/.test(value)
  },
})

extend('price-ranges-duplicates', {
  message: 'Zakresy cen nie mogą zawierać zduplikowanych progów',
  validate: (value) => {
    const values: number[] = []

    const cond = (value as ShippingMethodPriceRangeDTO[]).every(({ start }) => {
      const isDuplicate = values.includes(+start)
      values.push(+start)
      return !isDuplicate
    })
    return cond
  },
})
