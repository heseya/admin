import { sdk } from '@/api'

interface OrdersCountSummary {
  amount: number
  count: number
}

export const getPaymentsCount = async (
  from: number | Date,
  to: number | Date,
): Promise<OrdersCountSummary> => {
  const params = from ? { from: new Date(from), to: new Date(to) } : {}
  const data = await sdk.Analytics.getPayments(params)
  return data?.total || { amount: 0, count: 0 }
}
