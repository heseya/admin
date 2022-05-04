import { createVuexCRUD } from './generator'
import { Consent, ConsentDTO } from '@/interfaces/Consent'

export const consents = createVuexCRUD<Consent, ConsentDTO, ConsentDTO>()('consents', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
