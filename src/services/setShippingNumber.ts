/* eslint-disable camelcase */
import { api } from '@/api'
import { Order } from '@/interfaces/Order'

export const setShippingNumber = async (orderId: string, newShippingNumber: string) => {
  try {
    const { status, data } = await api.patch<{ data: Order }>(`/orders/id:${orderId}`, {
      shipping_number: newShippingNumber,
    })

    if (status !== 200) {
      throw new Error('Invalid response status code')
    }

    return {
      success: true,
      shippingNumber: data.data.shipping_number,
    } as const
  } catch (error: any) {
    return {
      success: false,
      error,
    } as const
  }
}
