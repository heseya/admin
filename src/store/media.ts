import { CdnMedia, CdnMediaCreateDto, CdnMediaUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const media = createVuexCRUD<CdnMedia, CdnMediaCreateDto, CdnMediaUpdateDto>()('media', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
