import { api } from '@/api'
import { ResponseMeta } from '@/interfaces/Response'
import { WebHook, WebHookDto, WebHookEventLogEntry, WebHookEventObject } from '@/interfaces/Webhook'
import { stringifyQueryParams } from '@/utils/stringifyQuery'
import { createVuexCRUD, StoreMutations } from './generator'

const BASE_URL = 'webhooks'

export const webhooks = createVuexCRUD<WebHook, WebHookDto, WebHookDto>()(BASE_URL, {
  state: {
    events: [] as WebHookEventObject[],
    logs: [] as WebHookEventLogEntry[],
    logsMeta: {} as ResponseMeta,
  },
  getters: {},
  mutations: {
    SET_EVENTS(state, events: WebHookEventObject[]) {
      state.events = events
    },
    SET_LOGS(state, events: WebHookEventLogEntry[]) {
      state.logs = events
    },
    SET_LOGS_META(state, meta: ResponseMeta) {
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
        const response = await api.get<{ data: WebHookEventLogEntry[]; meta: ResponseMeta }>(
          `/webhooks/logs${params}`,
        )
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
