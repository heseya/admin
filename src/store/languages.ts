import { Language, LanguageCreateDto, LanguageUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const languages = createVuexCRUD<Language, LanguageCreateDto, LanguageUpdateDto>()(
  'languages',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {},
  },
)
