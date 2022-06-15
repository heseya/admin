import { createVuexCRUD } from './generator'
import { api } from '@/api'
import { App, AppCreateDto } from '@heseya/store-core'

export const apps = createVuexCRUD<App, AppCreateDto, AppCreateDto>()('apps', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async addApp(_u, url: string) {
      try {
        const { data } = await api.post('/apps', { url })
        return data
      } catch (error: any) {
        return false
      }
    },
  },
})
