import { createVuexCRUD } from './generator'
import { Setting } from '@/interfaces/Settings'

export const settings = createVuexCRUD<Setting>()('settings', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
