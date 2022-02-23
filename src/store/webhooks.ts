import { api } from '@/api'
import { WebHook, WebHookDto, WebHookEventObject } from '@/interfaces/Webhook'
import { createVuexCRUD, StoreMutations } from './generator'

const BASE_URL = 'webhooks'

export const webhooks = createVuexCRUD<WebHook, WebHookDto, WebHookDto>()(BASE_URL, {
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
        const response = await api.get<{ data: WebHookEventObject[] }>(`/${BASE_URL}/events`)
        commit('SET_EVENTS', response.data.data)

        commit(StoreMutations.SetError, null)
      } catch (e: any) {
        commit(StoreMutations.SetError, e)
      }
      commit(StoreMutations.SetLoading, false)
    },
  },
})
