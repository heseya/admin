import { createVuexCRUD } from './generator'

import { SalesChannel, SalesChannelCreateDto, SalesChannelUpdateDto } from '@heseya/store-core'

export const salesChannels = createVuexCRUD<
  SalesChannel,
  SalesChannelCreateDto,
  SalesChannelUpdateDto
>()('sales-channels', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
