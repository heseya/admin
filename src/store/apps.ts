import { createVuexCRUD } from './generator'
import { api } from '@/api'
import { App } from '@/interfaces/App'

export const apps = createVuexCRUD<App>('APPS', 'apps', {
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async addApp({ commit }, url: string) {
      try {
        const { data } = await api.post('/apps', { url })
        return data
      } catch (error) {
        return false
      }
    },
  },
})
