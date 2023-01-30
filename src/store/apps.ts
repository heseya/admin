import { createVuexCRUD } from './generator'
import { App, AppCreateDto } from '@heseya/store-core'

export const apps = createVuexCRUD<App, AppCreateDto, AppCreateDto>()('apps', {
  state: {},
  getters: {
    getMicrofrontendsApps: (state) => state.data.filter((app) => !!app.microfrontend_url),
  },
  mutations: {},
  actions: {},
})
