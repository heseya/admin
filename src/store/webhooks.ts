import {
  WebHookEventObject,
  WebhookEntry,
  WebhookEntryCreateDto,
  WebhookEntryUpdateDto,
  WebhookEventLog,
  HeseyaPaginationMeta,
} from '@heseya/store-core'
import { sdk } from '@/api'
import { createVuexCRUD, StoreMutations } from './generator'

export const webhooks = createVuexCRUD<
  WebhookEntry,
  WebhookEntryCreateDto,
  WebhookEntryUpdateDto
>()('webhooks', {
  state: {
    events: [] as WebHookEventObject[],
    logs: [] as WebhookEventLog[],
    logsMeta: {} as HeseyaPaginationMeta,
  },
  getters: {},
  mutations: {
    SET_EVENTS(state, events: WebHookEventObject[]) {
      state.events = events
    },
    SET_LOGS(state, events: WebhookEventLog[]) {
      state.logs = events
    },
    SET_LOGS_META(state, meta: HeseyaPaginationMeta) {
      state.logsMeta = meta
    },
  },
  actions: {
    async fetchEvents({ commit }) {
      commit(StoreMutations.SetLoading, true)
      try {
        const events = await sdk.Webhooks.getEvents()
        commit('SET_EVENTS', events.data)

        commit(StoreMutations.SetError, null)
      } catch (e: any) {
        commit(StoreMutations.SetError, e)
      }
      commit(StoreMutations.SetLoading, false)
    },

    async fetchLogs({ commit }, parameters: Record<string, any>) {
      commit(StoreMutations.SetLoading, true)
      try {
        const { data, pagination } = await sdk.Webhooks.getLogs(parameters)
        commit('SET_LOGS', data)
        commit('SET_LOGS_META', pagination)

        commit(StoreMutations.SetError, null)
      } catch (e: any) {
        commit(StoreMutations.SetError, e)
      }
      commit(StoreMutations.SetLoading, false)
    },
  },
})
