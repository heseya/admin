import { api } from '@/api'

import { UUID } from '@/interfaces/UUID'

export const reorderCollection =
  (rootEndpoint: string, key: string, endpoint = 'reorder') =>
  async (ids: UUID[], parentId?: UUID) => {
    try {
      const suffix = parentId ? `/id:${parentId}` : ''
      await api.post<null>(`/${rootEndpoint}/${endpoint}${suffix}`, {
        [key]: ids,
      })
      return true
    } catch (error: any) {
      return false
    }
  }
