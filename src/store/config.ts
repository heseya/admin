import axios from 'axios'
import { actionTree, getterTree, mutationTree } from 'typed-vuex'

import { accessor } from './index'
import { getApiURL } from '@/utils/api'
import { getDefaultUiLanguage } from '@/utils/i18n'
import { Currency, SalesChannel } from '@heseya/store-core'
import { sdk } from '@/api'

const state = () => ({
  currency: '',
  salesChannel: null as null | SalesChannel,
  apiLanguage: null as null | string,
  uiLanguage: getDefaultUiLanguage(),
  // TODO: should be renamed to 'settings'
  env: {} as Record<string, string>,
  currencies: [] as Currency[],
})

const getters = getterTree(state, {
  /**
   * If all sales channels have a VAT rate equal to 0, we can surlly assume that all prices are gross.
   */
  allPricesGross(_state, _getters, rootState) {
    return (
      (rootState.salesChannels?.data as SalesChannel[])?.every(
        (sc) => parseFloat(sc.vat_rate) === 0,
      ) ?? false
    )
  },
})

const mutations = mutationTree(state, {
  SET_SETTINGS(state, newSettings: Record<string, string>) {
    state.env = newSettings
  },
  SET_CURRENCY(state, currencyCode: string) {
    state.currency = currencyCode
  },
  SET_SALES_CHANNEL(state, salesChannel: SalesChannel) {
    state.salesChannel = salesChannel
  },
  SET_CURRENCIES(state, currencies: Currency[]) {
    state.currencies = currencies
  },
  SET_API_LANGUAGE(state, language: string) {
    state.apiLanguage = language
  },
  SET_UI_LANGUAGE(state, language: string) {
    state.uiLanguage = language
  },
})

const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchSettings({ commit }) {
      // Fetch setting wtihout authorization, so it wont crash when auth is invalid
      const { data } = await axios.get<Record<string, string>>(`/settings?array`, {
        baseURL: getApiURL(),
      })
      commit('SET_SETTINGS', data)
    },

    async initLanguages({ state, commit }) {
      const languages = await accessor.languages.fetch()
      if (!languages) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch languages')
        return
      }

      const apiLanguage = languages.find(({ iso }) => iso === state.apiLanguage)

      if (!state.apiLanguage || !apiLanguage) {
        const defaultLang = languages.find((l) => l.default)
        if (defaultLang) commit('SET_API_LANGUAGE', defaultLang.iso)
      }
    },

    async fetchCurrencies({ commit, state }) {
      try {
        const data = await sdk.Currencies.get({})
        commit('SET_CURRENCIES', data)
        if (!state.currency || data.every((c) => c.code !== state.currency))
          commit('SET_CURRENCY', data[0].code)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch currencies', e)
      }
    },

    async initSalesChannel({ dispatch, state }) {
      if (!state.salesChannel) {
        const defaultChannel =
          accessor.salesChannels.data.find((s) => s.default) || accessor.salesChannels.data[0]

        dispatch('changeSalesChannel', defaultChannel)
      }
    },

    changeSalesChannel({ commit }, channel: SalesChannel) {
      commit('SET_SALES_CHANNEL', channel)
      commit('SET_CURRENCY', channel?.price_map?.currency || 'PLN')
    },
  },
)

export const config = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
