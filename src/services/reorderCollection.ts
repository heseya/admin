import { api } from '@/api'

import { ID } from '@/interfaces/ID'

export const reorderCollection =
  (rootEndpoint: string, key: string, endpoint = 'reorder') =>
  async (ids: ID[], parentId?: ID) => {
    try {
      const suffix = parentId ? `/id:${parentId}` : ''
      await api.post<null>(`/${rootEndpoint}/${endpoint}${suffix}`, {
        [key]: ids,
      })
      return true
    } catch (error) {
      return false
    }
  }
