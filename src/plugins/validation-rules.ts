import { extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import v from 'validator'

import { ShippingMethodPriceRangeDTO } from '@/interfaces/ShippingMethod'

import { ONLY_LETTERS_REGEX, SLUG_REGEX } from '@/consts/regexes'
import { isBefore } from 'date-fns'
import i18n from '@/i18n'

extend('required', {
  ...required,
  message: () => i18n.t('validation.required') as string,
})
extend('email', {
  ...email,
  message: () => i18n.t('validation.email') as string,
})

extend('repeatPassword', {
  params: ['target'],
  validate(password, { target }: Record<string, any>) {
    return password === target
  },
  message: () => i18n.t('validation.repeatPassword') as string,
})

extend('password', {
  validate(password: string) {
    return password.trim().length >= 12
  },
  message: () => i18n.t('validation.password') as string,
})

extend('positive', {
  message: () => i18n.t('validation.positive') as string,
  validate: (value) => {
    return value > 0
  },
})
extend('not-negative', {
  message: () => i18n.t('validation.notNegative') as string,
  validate: (value) => {
    return value >= 0
  },
})

extend('less-than', {
  params: ['target'],
  validate(value, { target }: Record<string, any>) {
    return value <= Number(target)
  },
  message: (_, props) =>
    i18n.t('validation.lessThan', { target: props._target_ || props.target }) as string,
})

extend('id-required', {
  message: () => i18n.t('validation.required') as string,
  validate: (value) => {
    return value !== 0
  },
})

extend('slug', {
  message: () => i18n.t('validation.slug') as string,
  validate: (value) => {
    return SLUG_REGEX.test(value)
  },
})

extend('url', {
  message: () => i18n.t('validation.url') as string,
  validate: (value) => {
    return v.isURL(value, {
      require_tld: false,
      require_protocol: true,
      protocols: ['http', 'https'],
    })
  },
})

extend('letters-only', {
  message: () => i18n.t('validation.lettersOnly') as string,
  validate: (value) => {
    return ONLY_LETTERS_REGEX.test(value)
  },
})

extend('date-before', {
  message: () => i18n.t('validation.dateBefore') as string,
  params: ['target'],
  validate(date, { target }: Record<string, any>) {
    return target ? isBefore(new Date(date), new Date(target)) : true
  },
})

extend('price-ranges-duplicates', {
  message: () => i18n.t('validation.priceRangesDuplicates') as string,
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
  message: () => i18n.t('validation.schemaCheckbox') as string,
})
