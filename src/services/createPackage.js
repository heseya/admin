import { api } from '@/api'

export const createPackage = async (orderId, packageTemplateId) => {
  try {
    const { status, data } = await api.post('furgonetka/create-package', {
      order_id: orderId,
      package_template_id: packageTemplateId
    })

    if (status !== 201) {
      throw new Error('Invalid response status code')
    }

    return {
      success: true,
      shippingNumber: data.shipping_number
    }
  } catch (error) {
    return {
      success: false,
      error
    }
  }
}
