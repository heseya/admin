export const formatCurrency = (value: number, currency: string) => {
  const formatter = new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  })
  return formatter.format(value)
}
