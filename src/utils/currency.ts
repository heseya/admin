import { Price, PriceDto } from '@heseya/store-core'

const formattersMap = new Map<string, Intl.NumberFormat>()

export const formatCurrency = (value: number | string, currency: string) => {
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

export const mapPricesToDto = (prices: Price[]): PriceDto[] =>
  prices.map(({ net, currency }) => ({ value: net, currency }))
