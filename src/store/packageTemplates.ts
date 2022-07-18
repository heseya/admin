import { PackagesTemplate } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const packageTemplates = createVuexCRUD<PackagesTemplate>()('package-templates', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
