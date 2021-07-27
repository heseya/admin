import { api } from '@/api'
import { format } from 'date-fns'

interface OrdersCountSummary {
  amount: number
  count: number
}

export const getPaymentsCount = async (
  from: number | Date,
  to: number | Date,
): Promise<OrdersCountSummary> => {
  const query = from
    ? `/analytics/payments?from=${format(from, 'yyyy-MM-dd')}&to=${format(to, 'yyyy-MM-dd')}`
    : '/analytics/payments'

  const { data } = await api.get<{ data?: { total: OrdersCountSummary } }>(query)
  return data.data?.total || { amount: 0, count: 0 }
}
