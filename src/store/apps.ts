import { createVuexCRUD } from './generator'
import { api } from '@/api'
import { App, AppCreateDto } from '@heseya/store-core'

export const apps = createVuexCRUD<App, AppCreateDto, AppCreateDto>()('apps', {
  state: {},
  getters: {
    getMicrofrontendsApps: (state) => state.data.filter((app) => !!app.microfrontend_url),
  },
  mutations: {},
  actions: {
    // TODO: is this used?
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
