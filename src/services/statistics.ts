import { sdk } from '@/api'
import { AnalyticsPayment } from '@heseya/store-core'

export const getPaymentsCount = async (
  from: number | Date,
  to: number | Date,
  currency: string,
): Promise<AnalyticsPayment> => {
  const params = from ? { from: new Date(from), to: new Date(to) } : {}
  const data = await sdk.Analytics.getPayments(params)
  return data?.total?.find((o) => o.currency === currency) || { amount: '0', count: 0, currency }
}
