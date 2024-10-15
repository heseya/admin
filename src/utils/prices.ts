export const calcGrossToNet = (grossAmount: number, vatRate: number): number => {
  return Math.round(((grossAmount * 100) / ((1 + vatRate) * 100)) * 100) / 100
}
