import { DiscountCode, DiscountCodeDto } from '@/interfaces/DiscountCode'
import { createVuexCRUD } from './generator'

export const discounts = createVuexCRUD<DiscountCode, DiscountCodeDto, DiscountCodeDto>()(
  'discounts',
  {
    state: {},
    getters: {},
    mutations: {},
    actions: {},
  },
)
