import { WebHook, WebHookDto } from '@/interfaces/Webhook'
import { createVuexCRUD } from './generator'

export const webhooks = createVuexCRUD<WebHook, WebHookDto, WebHookDto>()('webhooks', {
  state: {},
  getters: {},
  mutations: {},
  actions: {},
})
