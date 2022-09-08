import { Setting, SettingCreateDto, SettingUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const settings = createVuexCRUD<Setting, SettingCreateDto, SettingUpdateDto>()('settings', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
