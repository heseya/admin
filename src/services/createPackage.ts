/* eslint-disable camelcase */
import { api } from '@/api'

export const createPackage = async (orderId: string, packageTemplateId: string) => {
  try {
    const { status, data } = await api.post<{ shipping_number: string }>(
      'furgonetka/create-package',
      {
        order_id: orderId,
        package_template_id: packageTemplateId,
      },
    )

    if (status !== 201) {
      throw new Error('Invalid response status code')
    }

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
