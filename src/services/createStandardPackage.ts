/* eslint-disable camelcase */
import { api } from '@/api'

export const createStandardPackage = async (orderId: string, packageTemplateId: string) => {
  try {
    const { data } = await api.post<{ shipping_number: string }>(
      `orders/id:${orderId}/shipping-lists`,
      {
        package_template_id: packageTemplateId,
      },
    )

    return {
      success: true,
      shippingNumber: data.shipping_number,
    } as const
  } catch (error: any) {
    return {
      success: false,
      error,
    } as const
  }
}
