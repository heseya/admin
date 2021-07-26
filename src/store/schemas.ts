import { Schema } from '@/interfaces/Schema'
import { createVuexCRUD } from './generator'

export const schemas = createVuexCRUD<Schema>()('schemas', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
