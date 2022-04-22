import { createVuexCRUD } from './generator'

import { Banner, BannerDto } from '@/interfaces/Banner'

export const banners = createVuexCRUD<Banner, BannerDto, BannerDto>()('banners', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
