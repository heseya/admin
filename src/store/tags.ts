import { Tag, TagCreateDto, TagUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const tags = createVuexCRUD<Tag, TagCreateDto, TagUpdateDto>()('tags', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
