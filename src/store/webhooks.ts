import { api } from '@/api'
import { WebHook, WebHookDto, WebHookEventObject } from '@/interfaces/Webhook'
import { createVuexCRUD, StoreMutations } from './generator'

export const webhooks = createVuexCRUD<WebHook, WebHookDto, WebHookDto>()('webhooks', {
  state: {
    events: [] as WebHookEventObject[],
  },
  getters: {},
  mutations: {
    SET_EVENTS(state, events: WebHookEventObject[]) {
      state.events = events
    },
  },
  actions: {
    async fetchEvents({ commit }) {
      commit(StoreMutations.SetLoading, true)
      try {
        const response = await api.get<{ data: WebHookEventObject[] }>('/webhook/events')
        commit('SET_EVENTS', response.data.data)

        // TODO: remove
        // commit('SET_EVENTS', [
        //   {
        //     key: WebHookEvent.OrderCreated,
        //     name: 'Order Created',
        //     description: 'fajny opis lalalal',
        //   },
        //   {
        //     key: WebHookEvent.OrderUpdated,
        //     name: 'Order Updated',
        //     description: 'fajny opis lalalal',
        //   },
        //   {
        //     key: WebHookEvent.OrderUpdatedStatus,
        //     name: 'Order Updated Status',
        //     description: 'fajny opis lalalal',
        //   },
        //   {
        //     key: WebHookEvent.ProductCreated,
        //     name: 'Product Created',
        //     description: 'fajny opis lalalal',
        //   },
        // ])

        commit(StoreMutations.SetError, null)
      } catch (e: any) {
        commit(StoreMutations.SetError, e)
      }
      commit(StoreMutations.SetLoading, false)
    },
  },
})
