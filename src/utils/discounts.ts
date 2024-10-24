import { OrderDiscount } from '@heseya/store-core'
import { calcGrossToNet } from '@/utils/prices'

export const calcGrossDiscountsToNetDiscounts = (
  grossDiscounts: OrderDiscount[],
  vatRate: number,
): OrderDiscount[] => {
  return (grossDiscounts ?? []).map((discount) => ({
    ...discount,
    amount: discount.amount ? calcGrossToNet(+discount.amount, vatRate).toString() : null,
    applied_discount:
      discount.applied_discount !== ''
        ? calcGrossToNet(+discount.applied_discount, vatRate).toString()
        : '',
  }))
}
