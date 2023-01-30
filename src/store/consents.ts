import { createVuexCRUD } from './generator'
import { Consent, ConsentCreateDto, ConsentUpdateDto } from '@heseya/store-core'

export const consents = createVuexCRUD<Consent, ConsentCreateDto, ConsentUpdateDto>()('consents', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
