import queryString from 'query-string'
import { ActionTree, GetterTree, MutationTree } from 'vuex'

import { api } from '../api'

export type RootState = any

export interface ExtendStore<S> {
  state: S
  getters: GetterTree<S, RootState>
  mutations: MutationTree<S>
  actions: ActionTree<S, RootState>
}

/**
 * Creates state, actions and mutation for CRUD methods of given entity
 * @param name - uppercased string to be used in mutation names
 * @param endpoint - CRUD API endoint for given entity type
 * @param extend - custom state, actions, mutations and getters. Are merged with genereted ones
 */
export const createStore = <E>(name: string, endpoint: string, extend: ExtendStore<E>) => {
  const upperCaseName = name.toUpperCase()

  const mutationsNames = {
    SET_ERROR: `${upperCaseName}_SET_ERROR`,
    SET_META: `${upperCaseName}_SET_META`,
    SET_DATA: `${upperCaseName}_SET_DATA`,
    ADD_DATA: `${upperCaseName}_ADD_DATA`,
    EDIT_DATA: `${upperCaseName}_EDIT_DATA`,
    REMOVE_DATA: `${upperCaseName}_REMOVE_DATA`,
    SET_SELECTED: `${upperCaseName}_SET_SELECTED`,
    SET_LOADING: `${upperCaseName}_SET_LOADING`,
  }

  const state = () => ({
    ...(extend?.state || {}),
    error: null as null | Error,
    isLoading: false,
    meta: {} as any,
    data: [] as any[],
    selected: {} as any,
  })

  type StateType = ReturnType<typeof state>

  const getters: GetterTree<StateType, RootState> = {
    ...(extend?.getters || {}),
    getError(state) {
      return state.error
    },
    getIsLoading(state) {
      return state.isLoading
    },
    getMeta(state) {
      return state.meta
    },
    getSelected(state) {
      return state.selected
    },
    getData(state) {
      return state.data
    },
    getFromListById(state) {
      return (searchedId: string) => ({ ...state.data.find(({ id }) => id === searchedId) })
    },
  }

  // @ts-ignore
  const mutations: MutationTree<StateType> = {
    ...(extend?.mutations || {}),
    [mutationsNames.SET_ERROR](state, newError) {
      state.error = newError
    },
    [mutationsNames.SET_LOADING](state, isLoading) {
      state.isLoading = isLoading
    },
    [mutationsNames.SET_META](state, newMeta) {
      state.meta = newMeta
    },
    [mutationsNames.SET_DATA](state, newData = []) {
      state.data = newData
    },
    [mutationsNames.ADD_DATA](state, newItem) {
      state.data = [...state.data, newItem]
    },
    [mutationsNames.EDIT_DATA](state, { key, value, item: editedItem }) {
      const index = state.data.findIndex((item) => item[key] === value)
      if (index >= 0) {
        const copy = [...state.data]
        copy[index] = editedItem
        state.data = copy
      } else {
        state.data = [...state.data, editedItem]
      }
    },
    [mutationsNames.REMOVE_DATA](state, { key, value }) {
      state.data = state.data.filter((item) => item[key] !== value)
    },
    [mutationsNames.SET_SELECTED](state, newSelected) {
      state.selected = newSelected
    },
  }

  const actions: ActionTree<StateType, RootState> = {
    ...(extend?.actions || {}),
    async fetch({ commit }, query) {
      commit(mutationsNames.SET_ERROR, null)
      commit(mutationsNames.SET_LOADING, true)
      try {
        const filteredQuery = query
          ? Object.fromEntries(Object.entries(query).filter(([key, value]) => !!value))
          : {}
        const stringQuery = queryString.stringify(filteredQuery)

        const { data } = await api.get(`/${endpoint}?${stringQuery}`)
        commit(mutationsNames.SET_META, data.meta)
        commit(mutationsNames.SET_DATA, data.data)
        commit(mutationsNames.SET_LOADING, false)
        return true
      } catch (error) {
        commit(mutationsNames.SET_ERROR, error)
        commit(mutationsNames.SET_LOADING, false)
        return false
      }
    },
    async get({ commit }, id) {
      commit(mutationsNames.SET_ERROR, null)
      commit(mutationsNames.SET_LOADING, true)
      try {
        const { data: responseData } = await api.get(`/${endpoint}/id:${id}`)
        commit(mutationsNames.SET_SELECTED, responseData.data)
        commit(mutationsNames.SET_LOADING, false)
        return true
      } catch (error) {
        commit(mutationsNames.SET_ERROR, error)
        commit(mutationsNames.SET_LOADING, false)
        return false
      }
    },
    async add({ commit }, item) {
      commit(mutationsNames.SET_ERROR, null)
      commit(mutationsNames.SET_LOADING, true)
      try {
        const { data } = await api.post(`/${endpoint}`, item)
        commit(mutationsNames.ADD_DATA, data.data)
        commit(mutationsNames.SET_LOADING, false)
        return data.data
      } catch (error) {
        commit(mutationsNames.SET_ERROR, error)
        commit(mutationsNames.SET_LOADING, false)
        return false
      }
    },
    async edit({ commit }, { id, item }) {
      commit(mutationsNames.SET_LOADING, true)
      commit(mutationsNames.SET_ERROR, null)
      try {
        const { data } = await api.put(`/${endpoint}/id:${id}`, item)
        commit(mutationsNames.EDIT_DATA, { key: 'id', value: id, item: data.data })
        commit(mutationsNames.SET_LOADING, false)
        return data.data
      } catch (error) {
        commit(mutationsNames.SET_ERROR, error)
        commit(mutationsNames.SET_LOADING, false)
        return false
      }
    },
    async update({ commit }, { id, item }) {
      commit(mutationsNames.SET_LOADING, true)
      commit(mutationsNames.SET_ERROR, null)
      try {
        const { data } = await api.patch(`/${endpoint}/id:${id}`, item)
        commit(mutationsNames.EDIT_DATA, { key: 'id', value: id, item: data.data })
        commit(mutationsNames.SET_LOADING, false)
        return data.data
      } catch (error) {
        commit(mutationsNames.SET_ERROR, error)
        commit(mutationsNames.SET_LOADING, false)
        return false
      }
    },
    async updateByKey({ commit }, { key, value, item }) {
      commit(mutationsNames.SET_LOADING, true)
      commit(mutationsNames.SET_ERROR, null)
      try {
        const { data } = await api.patch(`/${endpoint}/${value}`, item)
        commit(mutationsNames.EDIT_DATA, { key, value, item: data.data })
        commit(mutationsNames.SET_LOADING, false)
        return data.data
      } catch (error) {
        commit(mutationsNames.SET_ERROR, error)
        commit(mutationsNames.SET_LOADING, false)
        return false
      }
    },
    async remove({ commit }, id) {
      commit(mutationsNames.SET_LOADING, true)
      commit(mutationsNames.SET_ERROR, null)
      try {
        await api.delete(`/${endpoint}/id:${id}`)
        commit(mutationsNames.REMOVE_DATA, { key: 'id', value: id })
        commit(mutationsNames.SET_LOADING, false)
        return true
      } catch (error) {
        commit(mutationsNames.SET_ERROR, error)
        commit(mutationsNames.SET_LOADING, false)
        return false
      }
    },
    async removeByKey({ commit }, { key, value }) {
      commit(mutationsNames.SET_LOADING, true)
      commit(mutationsNames.SET_ERROR, null)
      try {
        await api.delete(`/${endpoint}/${value}`)
        commit(mutationsNames.REMOVE_DATA, { key, value })
        commit(mutationsNames.SET_LOADING, false)
        return true
      } catch (error) {
        commit(mutationsNames.SET_ERROR, error)
        commit(mutationsNames.SET_LOADING, false)
        return false
      }
    },
  }

  return {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
  }
}

export default {
  createStore,
}
