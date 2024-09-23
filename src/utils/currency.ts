import { Price, PriceDto } from '@heseya/store-core'
import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'

const formattersMap = new Map<string, Intl.NumberFormat>()

export const formatCurrency = (value: number | string, currency: string) => {
  // TODO: REMOVE THIS BEFORE PRODUCTION !!!!!!!!!!!!!!!!!!!!
  if (!(isString(value) || isNumber(value))) {
    // eslint-disable-next-line no-console
    // console.error(`[Format Currency]: value must be string or number! value is: ${value}`)
    throw new Error(`[Format Currency]: value must be string or number! value is: ${value}`)
  }

  const formatter =
    formattersMap.get(currency) ||
    new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    })

  formattersMap.set(currency, formatter)

  const amount = typeof value === 'string' ? parseFloat(value) : value

  return formatter.format(amount ?? 0)
}

export const formatPrice = (price: Price) => {
  const { gross, currency } = price
  return formatCurrency(parseFloat(gross), currency)
}

export const mapPricesToDto = (prices: Price[]): PriceDto[] => {
  // TODO: REMOVE THIS BEFORE PRODUCTION !!!!!!!!!!!!!!!!!!!!
  if (typeof prices === 'undefined') {
    // eslint-disable-next-line no-console
    // console.error(`[mapPricesToDto]: prices must be defined!`)
    throw new Error(`[mapPricesToDto]: prices must be defined!`)
  }
  return prices.map(({ net, currency }) => ({ value: net, currency }))
}
