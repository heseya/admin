const formattersMap = new Map()

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
