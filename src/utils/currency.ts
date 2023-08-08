import { Price } from '@heseya/store-core'

const formattersMap = new Map<string, Intl.NumberFormat>()

export const formatCurrency = (value: number, currency: string) => {
  const formatter =
    formattersMap.get(currency) ||
    new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    })

  formattersMap.set(currency, formatter)

  return formatter.format(value ?? 0)
}

export const formatPrice = (price: Price) => {
  const { gross, currency } = price
  return formatCurrency(parseFloat(gross), currency)
}

export const parsePrices = (prices: Price[], currency: string) =>
  parseFloat((prices || []).find((price) => price.currency === currency)?.gross || '0') || 0
