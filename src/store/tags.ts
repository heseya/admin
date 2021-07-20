import { createVuexCRUD } from './generator'

import { Tag } from '@/interfaces/Tag'

export const tags = createVuexCRUD<Tag>('TAGS', 'tags', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
