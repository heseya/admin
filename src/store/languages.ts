import { Language, LanguageCreateDto, LanguageUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const languages = createVuexCRUD<Language, LanguageCreateDto, LanguageUpdateDto>()(
  'languages',
  {
    state: {},
    getters: {
      defaultLanguage(state) {
        return state.data.find((lang) => lang.default)
      },
      apiLanguage(state, _getters, rootState) {
        return state.data.find((lang) => lang.iso === rootState.config.apiLanguage)
      },
    },
    mutations: {},
    actions: {},
  },
)
