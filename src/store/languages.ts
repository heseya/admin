import { createVuexCRUD } from './generator'
import { Language, LanguageDto } from '@/interfaces/Language'

export const languages = createVuexCRUD<Language, LanguageDto, LanguageDto>()('languages', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
