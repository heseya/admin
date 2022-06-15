import {
  WebhookEntry,
  WebhookEntryCreateDto,
  WebhookEntryUpdateDto,
  WebhookEventLog,
} from '@heseya/store-core'
import { api } from '@/api'
import { WebHookEventObject } from '@/interfaces/Webhook'
import { stringifyQuery } from '@/utils/utils'
import { createVuexCRUD, StoreMutations } from './generator'

const BASE_URL = 'webhooks'

export const webhooks = createVuexCRUD<
  WebhookEntry,
  WebhookEntryCreateDto,
  WebhookEntryUpdateDto
>()(BASE_URL, {
  state: {
    events: [] as WebHookEventObject[],
    logs: [] as WebhookEventLog[],
  },
  getters: {},
  mutations: {
    SET_EVENTS(state, events: WebHookEventObject[]) {
      state.events = events
    },
    SET_ACTIVE_EVENTS(state, events: WebhookEventLog[]) {
      state.logs = events
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

    async fetchLogs({ commit }, parameters: Record<string, any>) {
      commit(StoreMutations.SetLoading, true)
      try {
        const params = stringifyQuery(parameters)
        const response = await api.get<{ data: WebhookEventLog[] }>(`/webhooks/logs${params}`)
        commit('SET_ACTIVE_EVENTS', response.data.data)

        commit(StoreMutations.SetError, null)
      } catch (e: any) {
        commit(StoreMutations.SetError, e)
      }
      commit(StoreMutations.SetLoading, false)
    },
  },
})
