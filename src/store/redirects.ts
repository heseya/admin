import { Redirect, RedirectCreateDto, RedirectUpdateDto } from '@heseya/store-core'
import { createVuexCRUD } from './generator'

export const redirects = createVuexCRUD<Redirect, RedirectCreateDto, RedirectUpdateDto>()(
  'redirects',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {},
  },
)
