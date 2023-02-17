import { createVuexCRUD } from './generator'

import { WarehouseDeposit, WarehouseDepositDto } from '@heseya/store-core'

export const deposits = createVuexCRUD<
  WarehouseDeposit,
  WarehouseDepositDto,
  WarehouseDepositDto
>()('deposits', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
