import {
  WebHookEventObject,
  WebhookEntry,
  WebhookEntryCreateDto,
  WebhookEntryUpdateDto,
  WebhookEventLog,
  HeseyaPaginatedResponseMeta,
} from '@heseya/store-core'
import { api } from '@/api'
import { stringifyQueryParams } from '@/utils/stringifyQuery'
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
    logsMeta: {} as HeseyaPaginatedResponseMeta,
  },
  getters: {},
  mutations: {
    SET_EVENTS(state, events: WebHookEventObject[]) {
      state.events = events
    },
    SET_LOGS(state, events: WebhookEventLog[]) {
      state.logs = events
    },
    SET_LOGS_META(state, meta: HeseyaPaginatedResponseMeta) {
      state.logsMeta = meta
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
        const params = stringifyQueryParams(parameters)
        const response = await api.get<{
          data: WebhookEventLog[]
          meta: HeseyaPaginatedResponseMeta
        }>(`/webhooks/logs${params}`)
        commit('SET_LOGS', response.data.data)
        commit('SET_LOGS_META', response.data.meta)

        commit(StoreMutations.SetError, null)
      } catch (e: any) {
        commit(StoreMutations.SetError, e)
      }
      commit(StoreMutations.SetLoading, false)
    },
  },
})
