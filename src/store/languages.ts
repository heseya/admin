import { Language, LanguageCreateDto, LanguageUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const languages = createVuexCRUD<Language, LanguageCreateDto, LanguageUpdateDto>()(
  'languages',
  {
    state: {},
    getters: {
      default(state) {
        return state.data.find((lang) => lang.default)
      },
    },
    mutations: {},
    actions: {},
  },
)
