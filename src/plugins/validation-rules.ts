import { extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import v from 'validator'

import { ShippingMethodPriceRangeDTO } from '@/interfaces/ShippingMethod'

import { ONLY_LETTERS_REGEX, PASSWORD_REGEX, SLUG_REGEX } from '@/consts/regexes'
import { isBefore } from 'date-fns'

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
  validate(password: string) {
    return PASSWORD_REGEX.test(password)
  },
  message:
    'Hasło musi mieć przynajmniej 10 znaków oraz zawierać małą, dużą literę, cyfrę i znak specjalny',
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

extend('less-than', {
  params: ['target'],
  validate(value, { target }: Record<string, any>) {
    return value <= target
  },
  message: 'Wartość musi być mniejsza bądź równa od {_target_}',
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
    return SLUG_REGEX.test(value)
  },
})

extend('url', {
  message: 'Wartość musi być poprawnym adresem URL',
  validate: (value) => {
    return v.isURL(value, {
      require_tld: false,
      require_protocol: true,
      protocols: ['http', 'https'],
    })
  },
})

extend('letters-only', {
  message: 'Wartość może składać się tylko z liter i podkreślników (_)',
  validate: (value) => {
    return ONLY_LETTERS_REGEX.test(value)
  },
})

extend('date-before', {
  message: 'Data zakończenia musi być przed datą startu',
  params: ['target'],
  validate(date, { target }: Record<string, any>) {
    return target ? isBefore(new Date(date), new Date(target)) : true
  },
})

extend('price-ranges-duplicates', {
  message: 'Zakresy cen nie mogą zawierać zduplikowanych progów',
  validate: (priceRanges: ShippingMethodPriceRangeDTO[]) => {
    const startValues: number[] = []

    return priceRanges.every(({ start }) => {
      const isDuplicate = startValues.includes(+start)
      startValues.push(+start)
      return !isDuplicate
    })
  },
})

extend('schema-checkbox', {
  params: ['target'],
  validate(value, { target }: Record<string, any>) {
    return !(value && target)
  },
  message: 'Schemat nie może być jednocześnie ukryty i wymagany',
})
