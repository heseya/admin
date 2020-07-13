import { api } from '@/api'

export const createPackage = async (orderId, packageTemplateId) => {
  try {
    const { status } = await api.post('furgonetka/create-package', {
      order_id: orderId,
      package_template_id: packageTemplateId
    })

    if (status !== 204) {
      throw new Error('Invalid response status')
    }

    return null
  } catch (e) {
    return e
  }
}
