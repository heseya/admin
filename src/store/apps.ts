import { createVuexCRUD } from './generator'
import { api } from '@/api'
import { App, CreateAppDto } from '@/interfaces/App'

export const apps = createVuexCRUD<App, CreateAppDto, CreateAppDto>()(
  'apps',
  {
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
  },
  // { remove: { force: 1 } },
)
