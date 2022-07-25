import { createVuexCRUD } from './generator'

import { Banner, BannerCreateDto, BannerUpdateDto } from '@heseya/store-core'

export const banners = createVuexCRUD<Banner, BannerCreateDto, BannerUpdateDto>()('banners', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
