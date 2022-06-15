import { PackageTemplate } from '@/interfaces/PackageTemplate'
import { createVuexCRUD } from './generator'

export const packageTemplates = createVuexCRUD<PackageTemplate>()('package-templates', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
