/* eslint-disable camelcase */
import { api } from '@/api'

/**
 * @deprecated
 * ! Deprecated in favor of new package creation method
 */
//TODO: Delete in the future
export const createFurgonetkaPackage = async (
  orderId: string,
  packageTemplateId: string,
  provider: string,
) => {
  try {
    // TODO[SDK]: request does not exist in sdk
    const { status, data } = await api.post<{ shipping_number: string }>(
      'furgonetka/create-package',
      {
        order_id: orderId,
        package_template_id: packageTemplateId,
        provider,
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