import { Setting } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const settings = createVuexCRUD<Setting>()('settings', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
