import { api } from '@/api'

import { ID } from '@/interfaces/ID'

export const reorderCollection =
  (rootEndpoint: string, key: string, endpoint = 'reorder') =>
  async (ids: ID[], parentId?: ID) => {
    try {
      const suffix = parentId ? `/id:${parentId}` : ''
      const { data } = await api.post(`/${rootEndpoint}/${endpoint}${suffix}`, {
        [key]: ids,
      })
      return data
    } catch (error) {
      return false
    }
  }
