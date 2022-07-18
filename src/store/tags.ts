import { Tag } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const tags = createVuexCRUD<Tag>()('tags', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
