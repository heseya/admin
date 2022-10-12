import {
  PackagesTemplate,
  PackagesTemplateCreateDto,
  PackagesTemplateUpdateDto,
} from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const packageTemplates = createVuexCRUD<
  PackagesTemplate,
  PackagesTemplateCreateDto,
  PackagesTemplateUpdateDto
>()('package-templates', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
