import { extend } from 'vee-validate'
import { required, email } from 'vee-validate/dist/rules'
import v from 'validator'
import { isArray, isNaN, isNumber } from 'lodash'
import { isBefore, isSameDay } from 'date-fns'

import { ShippingMethodPriceRangeDTO } from '@/interfaces/ShippingMethod'

import { METADATA_NAME_REGEX, ONLY_LETTERS_REGEX, SLUG_REGEX } from '@/consts/regexes'
import i18n from '@/i18n'
import { AddressDto } from '@/interfaces/Address'

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
    const maxValue = isNumber(target) ? target : parseFloat(target)
    return isNaN(maxValue) || value <= maxValue
  },
  message: (_, props) => {
    const value: string = props._target_ || props.target
    const text = isNaN(Number(value)) ? (i18n.t('validation.lessThanFallback') as string) : value
    return i18n.t('validation.lessThan', { target: text }) as string
  },
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

extend('metadata-name', {
  message: () => i18n.t('validation.metadataName') as string,
  validate: (value) => {
    return METADATA_NAME_REGEX.test(value)
  },
})

extend('responsive-media-valid', {
  message: () => i18n.t('validation.responsiveMediaValid') as string,
  validate: (value) => {
    return (
      isArray(value) && value.length > 0 && value.every((list) => isArray(list) && list.length > 0)
    )
  },
})

extend('date-before', {
  message: () => i18n.t('validation.dateBefore') as string,
  params: ['target'],
  validate(date, { target }: Record<string, any>) {
    return target ? isBefore(new Date(date), new Date(target)) : true
  },
})

extend('date-same-or-before', {
  message: () => i18n.t('validation.dateBefore') as string,
  params: ['target'],
  validate(date, { target }: Record<string, any>) {
    if (!target) return true

    const current = new Date(date)
    const targetDate = new Date(target)

    return isBefore(current, targetDate) || isSameDay(current, targetDate)
  },
})

extend('time-same-or-before', {
  message: () => i18n.t('validation.timeBefore') as string,
  params: ['target'],
  validate(date, { target }: Record<string, any>) {
    const [hour, minute, second] = (date as string).split(':').map((v) => parseInt(v))
    const [targetHour, targetMinute, targetSecond] = (target as string)
      .split(':')
      .map((v) => parseInt(v))

    if (hour < targetHour) return true
    if (hour == targetHour && minute < targetMinute) return true
    if (hour == targetHour && minute == targetMinute && second <= targetSecond) return true
    return false
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

extend('block-if-error', {
  message: 'error',
  validate(isError) {
    return !isError
  },
})

extend('shipping-points-duplicates', {
  params: ['existingPoints', 'editMode'],
  message: () => i18n.t('validation.shippingPointsDuplicates') as string,
  validate: (shippingPoint, { existingPoints, editMode }: Record<string, any>) => {
    if (editMode) return true
    return !existingPoints.some((point: AddressDto) => point.name === shippingPoint)
  },
})
