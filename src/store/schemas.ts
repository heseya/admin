import { Schema, SchemaCreateDto, SchemaUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const schemas = createVuexCRUD<Schema, SchemaCreateDto, SchemaUpdateDto>()('schemas', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
