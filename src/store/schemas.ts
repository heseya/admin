import { Schema, SchemaDto } from '@/interfaces/Schema'
import { createVuexCRUD } from './generator'

export const schemas = createVuexCRUD<Schema, SchemaDto, SchemaDto>()('schemas', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
