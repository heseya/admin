import { createVuexCRUD } from './generator'

export const packageTemplates = createVuexCRUD()('package-templates', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
